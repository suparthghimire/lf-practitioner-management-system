import express from "express";
import { DayName } from "@prisma/client";
const router = express.Router();

import { PractitionerLogin } from "../middleware/Auth.Middleware";
import AttendanceController from "../controllers/Attendance.Controller";

router.get("/", PractitionerLogin, AttendanceController.getAllByPractitioner);
router.get(
  "/today",
  PractitionerLogin,
  AttendanceController.getTodayAttendanceByPractitioner
);
router.post("/checkin", PractitionerLogin, AttendanceController.checkIn);
router.put("/checkout", PractitionerLogin, AttendanceController.checkOut);

export default router;
