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

/* Controller Imports */
import PractitionerController from "./controllers/Practitioner.Controller";

/* Middleware Imports */
import { IsLoggedIn } from "./middleware/Auth.Middleware";
import { HasWritePermission } from "./middleware/Authorization.Middleware";
/* Configf Import */
import CONFIG from "./utils/app_config";
// configure .env files
dotenv.config();

const app = express();

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
  app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
}
// configure prisma client
/**
 * Prisma Docs suggests to create a new instance of PrismaClient once and use it everywhere
 */
export const prismaClient = new PrismaClient();
