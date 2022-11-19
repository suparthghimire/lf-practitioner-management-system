import express from "express";
import { DayName } from "@prisma/client";
const router = express.Router();

import UserController from "../controllers/User.Controller";
import { IsLoggedIn } from "../middleware/Auth.Middleware";

router.get("/dashboard", IsLoggedIn, UserController.index); // User Data

export default router;
