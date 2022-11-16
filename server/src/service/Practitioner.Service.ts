import { Practitioner } from "../models/Practitioner";
import { prismaClient } from "../index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GetPagination } from "../utils/helpers";
import { PRISMA_ERROR_CODES } from "../utils/prisma_error_codes";

const PractitionerService = {
  getPractitionerByEmail: async (email: string) => {
    try {
      const practitioner = await prismaClient.practitioner.findUnique({
        where: {
          email: email,
        },
      });
      return practitioner;
    } catch (error) {
      throw error;
    }
  },
  getPractitionerByContact: async (contact: string) => {
    try {
      const practitioner = await prismaClient.practitioner.findUnique({
        where: {
          contact: contact,
        },
      });
      return practitioner;
    } catch (error) {
      throw error;
    }
  },

  getAllPractitioners: async function (limit: number, page: number) {
    try {
      // set offset for pagination based on limit and page
      const offset = (page - 1) * limit;
      // take and limit are used for pagination in Prisma ORM, where Take is total records to be fetched and skip is the offset
      const take = limit;
      const skip = offset;
      // get all practitioners from database with pagination and ordered by descending order of creation date
      const unresolvedPractitioners = prismaClient.practitioner.findMany({
        include: {
          Specializations: true,
          WorkingDays: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
        skip,
      });
      // get total count of practitioners in database
      const unresolvedTotalData = prismaClient.practitioner.count();

      // resolve both promises in parallel as they are mutually exclusive to each other
      const [practitioners, totalData] = await Promise.all([
        unresolvedPractitioners,
        unresolvedTotalData,
      ]);

      // get pagination data
      const { nextPage, prevPage } = GetPagination(totalData, limit, page);
      const totalPages = Math.ceil(totalData / limit);

      // return fetched data along with pagination data
      return {
        nextPageNo: nextPage,
        prevPageNo: prevPage,
        totalPages,
        data: practitioners,
      };
    } catch (error) {
      throw error;
    }
  },
  getPractitionerById: async function (id: number) {
    try {
      const practitioner = await prismaClient.practitioner.findUnique({
        where: {
          id: id,
        },
        include: {
          WorkingDays: true,
          Specializations: true,
        },
      });
      if (!practitioner)
        throw new PrismaClientKnownRequestError(
          "",
          PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          ""
        );
      return practitioner;
    } catch (error) {
      throw error;
    }
  },
  // Create new practitioner
  createPractitioner: async function (practitioner: Practitioner) {
    try {
      return await prismaClient.practitioner.create({
        data: {
          fullname: practitioner.fullname,
          address: practitioner.address,
          contact: practitioner.contact,
          dob: practitioner.dob,
          email: practitioner.email,
          startTime: practitioner.startTime,
          endTime: practitioner.endTime,
          ICUSpecialist: practitioner.ICUSpecialist,
          image: practitioner.image,
          WorkingDays: {
            /**
             * connect or create tries to connect the relation model with the current model
             * if the relation model does not exist, it creates a new one and maintains the relation
             */
            connectOrCreate: practitioner.WorkingDays.map((day) => ({
              where: {
                id: day.id,
              },
              create: {
                day: day.day,
              },
            })),
          },
          // Specializations is an optional field, so we need to check if it is present or not
          ...(practitioner.Specializations && {
            // if present, then connect or create the relation
            Specializations: {
              connectOrCreate: practitioner.Specializations.map((spec) => ({
                where: { id: spec.id },
                create: { name: spec.name },
              })),
            },
          }),
        },
      });
    } catch (error) {
      throw error;
    }
  },
  updatePractitioner: async function (
    currWorkingDaysIdList: number[],
    currSpecializationsIdList: number[],
    newPractitioner: Practitioner
  ) {
    try {
      return await prismaClient.practitioner.update({
        where: {
          id: newPractitioner.id,
        },
        data: {
          fullname: newPractitioner.fullname,
          address: newPractitioner.address,
          contact: newPractitioner.contact,
          dob: newPractitioner.dob,
          email: newPractitioner.email,
          startTime: newPractitioner.startTime,
          endTime: newPractitioner.endTime,
          ICUSpecialist: newPractitioner.ICUSpecialist,
          image: newPractitioner.image,
          WorkingDays: {
            // whilt updating, we need to delete the old relations and create new ones
            disconnect: currWorkingDaysIdList.map((id) => ({
              id: id,
            })),
            // Connect or create relationship with the new relation model
            connectOrCreate: newPractitioner.WorkingDays.map((day) => ({
              where: {
                id: day.id,
              },
              create: {
                day: day.day,
              },
            })),
          },
          // Specializations is an optional field, so we need to check if it is present or not
          ...(newPractitioner.Specializations && {
            Specializations: {
              // whilt updating, we need to delete the old relations and create new ones
              disconnect: currSpecializationsIdList.map((id) => ({
                id: id,
              })),
              // if present, then connect or create relationship with the new relation model
              connectOrCreate: newPractitioner.Specializations.map((spec) => ({
                where: { id: spec.id },
                create: { name: spec.name },
              })),
            },
          }),
        },
      });
    } catch (error) {
      throw error;
    }
  },
  // Delete practitioner by id
  deletePractitioner: async function (id: number) {
    try {
      await prismaClient.practitioner.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default PractitionerService;
