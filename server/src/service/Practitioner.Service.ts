import { DayName } from "@prisma/client";
import moment from "moment";
import { Practitioner } from "../models/Practitioner";
import { prismaClient } from "../index";
import { GetPagination } from "../utils/helpers";
import { PRISMA_ERROR_CODES } from "../utils/prisma_error_codes";
import WorkingDayService from "./WorkingDay.Service";
import bcrypt from "bcrypt";
import { CustomError } from "./Error.Service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
  getPractitionersWorkingToday: async (userId: number) => {
    try {
      const weekDayName = moment().format("dddd");
      const todayData = await prismaClient.practitioner.count({
        where: {
          createdByUserId: userId,
          WorkingDays: {
            some: {
              day: weekDayName as DayName,
            },
          },
        },
      });
      const totalPractitioners = await prismaClient.practitioner.count({
        where: {
          createdByUserId: userId,
        },
      });

      return {
        todayData,
        totalPractitioners,
        todayPercent: todayData / totalPractitioners,
      };
    } catch (error) {
      throw error;
    }
  },
  getAllPractitioners: async function (
    limit: number,
    page: number,
    userId: number
  ) {
    try {
      console.log("USER", userId);
      // set offset for pagination based on limit and page
      const offset = (page - 1) * limit;
      // take and limit are used for pagination in Prisma ORM, where Take is total records to be fetched and skip is the offset
      const take = limit;
      const skip = offset;

      const today = moment().startOf("day").toDate();
      // get all practitioners from database with pagination and ordered by descending order of creation date
      const unresolvedPractitioners = prismaClient.practitioner.findMany({
        where: {
          createdByUserId: userId,
        },
        include: {
          Specializations: true,
          WorkingDays: true,
          Attendance: {
            where: {
              date: {
                gte: today,
                lt: moment(today).add(1, "day").toDate(),
              },
            },
          },
          createdBy: {
            select: { id: true, name: true },
          },
        },
        orderBy: [
          {
            icuSpecialist: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
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

      // console.log(practitioners);
      // return fetched data along with pagination data
      return {
        data: practitioners,
        totalData: totalData,
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
          Attendance: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      if (!practitioner)
        throw new PrismaClientKnownRequestError("Practitioner not found", {
          code: PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          clientVersion: "2.24.1",
        });
      return practitioner;
    } catch (error) {
      throw error;
    }
  },
  // Create new practitioner
  createPractitioner: async function (practitioner: Practitioner) {
    try {
      console.log("HADH PAS");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(practitioner.contact, salt);
      console.log("HADH PAS", hashedPassword);
      return await prismaClient.practitioner.create({
        data: {
          fullname: practitioner.fullname,
          address: practitioner.address,
          contact: practitioner.contact,
          dob: practitioner.dob,
          email: practitioner.email,
          startTime: practitioner.startTime,
          endTime: practitioner.endTime,
          icuSpecialist: practitioner.icuSpecialist,
          image: practitioner.image,
          createdByUserId: practitioner.createdBy,
          password: hashedPassword,
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
          icuSpecialist: newPractitioner.icuSpecialist,
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
  authenticate: async function (email: string, password: string) {
    try {
      const practitioner = await prismaClient.practitioner.findUnique({
        where: {
          email: email,
        },
        include: {
          Attendance: true,
          Specializations: true,
          PractitionerTwoFA: true,
          WorkingDays: {
            select: {
              day: true,
            },
          },
        },
      });
      if (!practitioner)
        throw new CustomError("Invalid Email or Password", 401);

      // compare password
      const storedPwd = practitioner.password;
      const isPwdMatch = await bcrypt.compare(password, storedPwd);

      if (!isPwdMatch) throw new CustomError("Invalid Email or Password", 401);

      return practitioner;
    } catch (error) {
      throw error;
    }
  },
};

export default PractitionerService;
