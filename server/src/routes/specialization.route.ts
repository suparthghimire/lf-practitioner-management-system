import express from "express";
import { DayName } from "@prisma/client";
const router = express.Router();

import SpecializationController from "../controllers/Specialization.Controller";
import { IsLoggedIn } from "../middleware/Auth.Middleware";

router.get("/", IsLoggedIn, SpecializationController.index); // User Data

export default router;
