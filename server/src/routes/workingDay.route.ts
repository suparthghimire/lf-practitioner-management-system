import express from "express";
import { DayName } from "@prisma/client";
const router = express.Router();

import WorkingDayController from "../controllers/WorkingDay.Controller";
import { IsLoggedIn } from "../middleware/Auth.Middleware";

router.get("/", IsLoggedIn, WorkingDayController.index); // User Data

export default router;
