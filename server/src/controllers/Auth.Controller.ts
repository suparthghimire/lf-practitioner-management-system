import { Request, Response } from "express";
import { User, ValidateUser } from "../models/User";
import UserService from "../service/User.Service";
const AuthController = {
  index: (req: Request, res: Response) =>
    res.status(200).json({ message: "Index Endpoint" }),
  signIn: (req: Request, res: Response) =>
    res.status(201).json({ message: "SignIn Endpoint" }),
  signUp: async function (req: Request, res: Response) {
    try {
      const body = req.body;
      const user: User = body;
      ValidateUser(user);
      await UserService.createUser(user);
      return res.status(201).json({ message: "SignUp Successful!", user });
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: "Error",
        error: error,
      });
    }
  },
  signOut: (req: Request, res: Response) =>
    res.status(201).json({ message: "SignOut Endpoint" }),
};
export default AuthController;
