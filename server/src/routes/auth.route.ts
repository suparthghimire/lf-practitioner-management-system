import express from "express";
import { DayName } from "@prisma/client";
const router = express.Router();

import AuthController from "../controllers/Auth.Controller";
import { IsLoggedIn, IsLoggedOut } from "../middleware/Auth.Middleware";

router.get("/", IsLoggedIn, AuthController.index); // User Data
router.delete("/signout", AuthController.signOut); //Logout
router.post("/refresh", AuthController.refreshToken); //refresh token

router.post("/signin", AuthController.signIn); //Login
router.post("/signup", IsLoggedOut, AuthController.signUp); //Register

export default router;
