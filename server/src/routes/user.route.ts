import express from "express";
import { DayName } from "@prisma/client";
const router = express.Router();

import UserController from "../controllers/User.Controller";
import { IsLoggedIn } from "../middleware/Auth.Middleware";
import TwoFAController from "../controllers/TwoFA.Controller";

router.get("/dashboard", IsLoggedIn, UserController.index); // User Data

router.post("/2fa/generate", IsLoggedIn, TwoFAController.generate); // Generate 2FA
router.delete("/2fa/remove", IsLoggedIn, TwoFAController.remove); // Generate 2FA
router.patch("/2fa/verify", IsLoggedIn, TwoFAController.verify); // Generate 2FA

export default router;
