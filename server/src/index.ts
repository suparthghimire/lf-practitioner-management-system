import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
/* Route Imports */
import AuthRoutes from "./routes/auth.route";
import PractitionerRoutes from "./routes/practitioner.route";
import PractitionerController from "./controllers/Practitioner.Controller";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", AuthRoutes);
app.use("/practitioner", PractitionerRoutes);

/*
 * The Assignment Mentioned the API
 * for delete endpoint to be
 * patient/{practitioner_id}
 * This is a mistake, it should be
 * practitioner/{practitioner_id}
 * Nevertheless, I have implemented both
 */

app.delete("/patient/:practitioner_id", PractitionerController.delete);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at ${PORT}`));

export const prismaClient = new PrismaClient();
