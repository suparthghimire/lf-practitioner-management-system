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
import { ZodError } from "zod";
const AttendanceService = {
  create: async (time: Date, practitionerId: number) => {
    return await prismaClient.attendance.create({
      data: {
        practitionerId: practitionerId,
        date: time,
        checkInTime: null,
        checkOutTime: null,
        duration: null,
        minHrAchieved: null,
      },
    });
  },
  checkIn: async (time: Date, practitionerId: number) => {
    //  update attendance
    const today = moment().startOf("day").toDate();
    const currAttendance = await prismaClient.attendance.findFirst({
      where: {
        practitionerId: practitionerId,
        date: {
          gte: today,
          lt: moment(today).add(1, "day").toDate(),
        },
      },
      include: { Practitioner: true },
    });
    if (!currAttendance) throw new CustomError("Attendance not found", 404);
    // see if checkin is already done
    if (currAttendance.checkInTime)
      throw new CustomError("Already checked in", 400);
    //  see if checkout is already done
    if (currAttendance.checkOutTime)
      throw new CustomError("Already checked out", 400);

    // check if checkin is before start time
    if (moment(time).isBefore(moment(currAttendance.Practitioner.startTime)))
      throw new ZodError([
        {
          code: "custom",
          message: "Checkin time cannot be before start time",
          path: ["time"],
        },
      ]);

    const updateAttendance = await prismaClient.attendance.update({
      where: {
        id: currAttendance.id,
      },
      data: {
        checkInTime: time,
      },
    });

    return updateAttendance;
  },
  checkOut: async (time: Date, practitionerId: number) => {
    const today = moment().startOf("day").toDate();
    const currAttendance = await prismaClient.attendance.findFirst({
      where: {
        practitionerId: practitionerId,
        date: {
          gte: today,
          lt: moment(today).add(1, "day").toDate(),
        },
      },
      include: { Practitioner: true },
    });

    if (!currAttendance) throw new CustomError("Attendance not found", 404);
    // see if checkout is already done
    if (currAttendance.checkOutTime)
      throw new CustomError("Already checked out", 400);

    const checkInTime = currAttendance.checkInTime;

    // cjecl if checkout is before checkin
    if (moment(time).isBefore(moment(checkInTime))) {
      throw new ZodError([
        {
          code: "custom",
          message: "Checkout time cannot be before checkin time",
          path: ["checkOutTime"],
        },
      ]);
    }
    const attendanceDuration = moment(time).diff(
      moment(checkInTime),
      "seconds"
    );

    const pracReqHrs = moment(currAttendance.Practitioner.endTime).diff(
      moment(currAttendance.Practitioner.startTime),
      "seconds"
    );

    return await prismaClient.attendance.update({
      where: {
        id: currAttendance.id,
      },
      data: {
        checkOutTime: time,
        wasLate: moment(checkInTime).isAfter(
          moment(currAttendance.Practitioner.startTime)
        ),
        duration: attendanceDuration,
        minHrAchieved: attendanceDuration >= pracReqHrs,
        wasOvertime: attendanceDuration > pracReqHrs,
      },
    });
  },
  getAllAttendanceByPractitioner: async (practitionerId: number) => {
    const attendance = await prismaClient.attendance.findMany({
      where: {
        practitionerId: practitionerId,
      },
      orderBy: {
        date: "desc",
      },
    });
    return attendance;
  },

  getTodayAttendanceByPractitioner: async (practitionerId: number) => {
    // find attendance whose month, day and year matches today's month day and year
    const today = moment().startOf("day").toDate();
    const attendance = await prismaClient.attendance.findFirst({
      where: {
        practitionerId: practitionerId,
        date: {
          gte: today,
          lt: moment(today).add(1, "day").toDate(),
        },
      },
    });
    return attendance;
  },
  generateAttendance: async () => {
    // for all practitioners, generate attendance
    const todayDayName = moment().format("dddd") as DayName;
    const practitioners = await prismaClient.practitioner.findMany({
      select: {
        id: true,
        fullname: true,
        WorkingDays: true,
      },
      where: {
        WorkingDays: {
          some: {
            day: todayDayName,
          },
        },
      },
    });

    await prismaClient.attendance.createMany({
      data: practitioners.map((practitioner) => ({
        practitionerId: practitioner.id,
        date: new Date(),
        checkInTime: null,
        checkOutTime: null,
        duration: null,
        minHrAchieved: null,
      })),
    });
  },
};

export default AttendanceService;
