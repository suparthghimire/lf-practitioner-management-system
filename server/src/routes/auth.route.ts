import express from "express";
const router = express.Router();

import AuthController from "../controllers/Auth.Controller";
import { IsLoggedIn, IsLoggedOut } from "../middleware/Auth.Middleware";

router.get("/", IsLoggedIn, AuthController.index); // User Data

router.post("/signin", IsLoggedOut, AuthController.signIn); //Login
router.post("/signup", IsLoggedOut, AuthController.signUp); //Register
router.delete("/signout", IsLoggedOut, AuthController.signOut); //Logout

export default router;
