import { Practitioner } from "../models/Practitioner";
import { prismaClient } from "../index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GetPagination } from "../utils/helpers";

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
      const offset = (page - 1) * limit;

      const take = limit;
      const skip = offset;
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
      const unresolvedTotalData = prismaClient.practitioner.count();

      const [practitioners, totalData] = await Promise.all([
        unresolvedPractitioners,
        unresolvedTotalData,
      ]);

      const { nextPage, prevPage } = GetPagination(totalData, limit, page);
      const totalPages = Math.ceil(totalData / limit);

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
        throw new PrismaClientKnownRequestError("", "2015", "");
      return practitioner;
    } catch (error) {
      throw error;
    }
  },
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
            connectOrCreate: practitioner.WorkingDays.map((day) => ({
              where: {
                id: day.id,
              },
              create: {
                day: day.day,
              },
            })),
          },
          ...(practitioner.Specializations && {
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
            disconnect: currWorkingDaysIdList.map((id) => ({
              id: id,
            })),
            connectOrCreate: newPractitioner.WorkingDays.map((day) => ({
              where: {
                id: day.id,
              },
              create: {
                day: day.day,
              },
            })),
          },
          ...(newPractitioner.Specializations && {
            Specializations: {
              disconnect: currSpecializationsIdList.map((id) => ({
                id: id,
              })),
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
