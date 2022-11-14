import express from "express";
const router = express.Router();

import AuthController from "../controllers/Auth.Controller";

router.get("/", AuthController.index); // User Data

router.post("/signin", AuthController.signIn); //Login
router.post("/signup", AuthController.signUp); //Register
router.delete("/signout", AuthController.signOut); //Logout

export default router;
