import { Request, Response } from "express";
import { User, ValidateUser } from "../models/User";
import ErrorService from "../service/Error.Service";
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
      console.log(user);
      ValidateUser(user);
      await UserService.createUser(user);
      return res.status(201).json({ message: "SignUp Successful!", user });
    } catch (error) {
      console.log(error);
      const { handledError, status } = ErrorService.handleError(error, "User");
      return res
        .status(status || 500)
        .json({ status: false, message: "SignUp Failed!", data: handledError });
    }
  },
  signOut: (req: Request, res: Response) =>
    res.status(201).json({ message: "SignOut Endpoint" }),
};
export default AuthController;
