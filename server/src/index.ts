import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import fileUpload from "express-fileupload";
import cors from "cors";
/* Route Imports */
import IndexRoute from "./routes/auth.route";
import UserRoute from "./routes/user.route";
import PractitionerRoutes from "./routes/practitioner.route";
import SpecializationRoutes from "./routes/specialization.route";
import WorkingDayRoutes from "./routes/workingDay.route";
import AttendanceRoutes from "./routes/attendance.route";
import cron from "node-cron";
/* Controller Imports */
import PractitionerController from "./controllers/Practitioner.Controller";

/* Middleware Imports */
import { IsLoggedIn } from "./middleware/Auth.Middleware";
import { HasWritePermission } from "./middleware/Authorization.Middleware";
/* Configf Import */
import CONFIG from "./utils/app_config";
import AttendanceService from "./service/Attendance.Service";
import moment from "moment";
// configure .env files
dotenv.config();
export const app = express();

/* Configure Cors */

app.use(
  cors({
    origin: [CONFIG.CLIENT_PRD_ENDPOINT, CONFIG.CLIENT_DEV_ENDPOINT],
    credentials: true,
  })
);

app.use(
  fileUpload({
    parseNested: true, // allow nested objects from form-data
  })
);
// configure express to use json
app.use(express.json());
// configure express to use cookie parser
// Externded true allows to parse nested objects
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
/**
 * Routes
 */
app.use("/", IndexRoute);
app.use("/user", UserRoute);
app.use("/day", WorkingDayRoutes);
app.use("/specialization", SpecializationRoutes);
app.use("/practitioner", PractitionerRoutes);
app.use("/attendance", AttendanceRoutes);

/*
 * The Assignment Mentioned the API
 * for delete endpoint to be
 * patient/{practitioner_id}
 * This is a mistake, it should be
 * practitioner/{practitioner_id}
 * Nevertheless, I have implemented both
 */

app.delete(
  "/patient/:practitioner_id",
  [IsLoggedIn, HasWritePermission],
  PractitionerController.delete
);
const PORT = CONFIG.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  console.log(process.env.CLIENT_DEV_ENDPOINT, process.env.CLIENT_PRD_ENDPOINT);
  app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
} // configure prisma client
/**
 * Prisma Docs suggests to create a new instance of PrismaClient once and use it everywhere
 */
export const prismaClient = new PrismaClient();

// every 24 hrs, create a new attendance record for all practitioners
// 0 0 * * *

const generate24HrsAttendance = async () => {
  const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  try {
    await AttendanceService.generateAttendance();
    console.log(`SUCCESS: ATTENDANCE FOR ${date} GENERATED`);
  } catch (error) {
    console.log(`ERROR: ATTENDANCE FOR ${date} NOT GENERATED DUE TO ERROR`);
    console.log(error);
  }
};
cron.schedule("0 0 * * * *", generate24HrsAttendance);

// generate24HrsAttendance();
