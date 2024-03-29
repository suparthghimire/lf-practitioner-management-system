import { Attendance } from "prisma/prisma-client";
import { Request, Response } from "express";
import ErrorService, { CustomError } from "../service/Error.Service";
import AttendanceService from "../service/Attendance.Service";
import {
  CheckinoutSchema,
  T_CheckInOut,
  ValidateCheckInOut,
} from "../models/Attendance";
const AttendanceController = {
  checkIn: async function (req: Request, res: Response) {
    try {
      const body = req.body;
      const data: T_CheckInOut = {
        time: new Date(body.checkInTime),
        practitionerId: body.practitionerId,
      };
      await ValidateCheckInOut(data);

      const attendance = await AttendanceService.checkIn(
        data.time,
        data.practitionerId
      );
      return res.status(201).json({
        status: true,
        message: "Checkin",
        data: attendance,
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "Attendance"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Fetch Attendances",
        data: data == null ? undefined : data,
      });
    }
  },
  checkOut: async function (req: Request, res: Response) {
    try {
      const body = req.body;

      const data: T_CheckInOut = {
        time: new Date(body.checkOutTime),
        practitionerId: body.practitionerId,
      };

      await ValidateCheckInOut(data);

      const attendance = await AttendanceService.checkOut(
        data.time,
        data.practitionerId
      );
      return res.status(201).json({
        status: true,
        message: "Checkout",
        data: attendance,
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "Attendance"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Fetch Attendances",
        data: data == null ? undefined : data,
      });
    }
  },
  getAllByPractitioner: async function (req: Request, res: Response) {
    const { practitionerId } = req.body;
    try {
      if (!practitionerId) throw new CustomError("Forbidden", 403);

      const attendances =
        await AttendanceService.getAllAttendanceByPractitioner(practitionerId);
      return res.status(201).json({
        status: true,
        message: "All Attendances",
        data: attendances,
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "Attendance"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Fetch Attendances",
        data: data == null ? undefined : data,
      });
    }
  },
  getTodayAttendanceByPractitioner: async function (
    req: Request,
    res: Response
  ) {
    try {
      const { practitionerId } = req.body;
      if (!practitionerId) throw new CustomError("Forbidden", 403);
      const attendance =
        await AttendanceService.getTodayAttendanceByPractitioner(
          practitionerId
        );
      return res.status(201).json({
        status: true,
        message: "Today's Attendance",
        data: attendance,
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "Attendance"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Fetch Attendance",
        data: data == null ? undefined : data,
      });
    }
  },
};
export default AttendanceController;
