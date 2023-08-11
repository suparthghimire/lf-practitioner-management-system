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
  checkIn: async (time: Date, practitionerId: number) => {
    // get practitioner
    const practitioner = await prismaClient.practitioner.findUnique({
      where: {
        id: practitionerId,
      },
      include: { WorkingDays: true },
    });
    if (!practitioner) throw new CustomError("Practitioner not found", 404);

    // see if practitioner was late
    const wasLate = moment(time).isAfter(practitioner.startTime);
    //   create attendance
    const attendance = await prismaClient.attendance.create({
      data: {
        checkInTime: time,
        wasLate: wasLate,
        practitionerId: practitionerId,
        date: new Date(),
        checkOutTime: null,
        duration: null,
        minHrAchieved: null,
      },
    });
    return attendance;
  },
  checkOut: async (time: Date, attendanceId: number) => {
    const currAttendance = await prismaClient.attendance.findUnique({
      where: {
        id: attendanceId,
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

    const attendance = await prismaClient.attendance.update({
      where: {
        id: attendanceId,
      },
      data: {
        checkOutTime: time,
        duration: attendanceDuration,
        minHrAchieved: attendanceDuration >= pracReqHrs,
        wasOvertime: attendanceDuration > pracReqHrs,
      },
    });
    return attendance;
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
};

export default AttendanceService;
