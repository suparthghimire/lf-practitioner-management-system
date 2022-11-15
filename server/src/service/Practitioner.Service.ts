import { Practitioner } from "../models/Practitioner";
import { prismaClient } from "../index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GetPagination } from "../utils/helpers";

const PractitionerService = {
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
                day: day.name,
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
  updatePractitioner: async function (practitioner: Practitioner) {
    try {
      return await prismaClient.practitioner.update({
        where: {
          id: practitioner.id,
        },
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
            disconnect: practitioner.WorkingDays.map((day) => ({
              id: day.id,
            })),
            connectOrCreate: practitioner.WorkingDays.map((day) => ({
              where: {
                id: day.id,
              },
              create: {
                day: day.name,
              },
            })),
          },
          ...(practitioner.Specializations && {
            Specializations: {
              disconnect: practitioner.Specializations.map((spec) => ({
                id: spec.id,
              })),
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
