import { Request, Response } from "express";
const AuthController = {
  index: (req: Request, res: Response) =>
    res.status(200).json({ message: "Index Endpoint" }),
  signIn: (req: Request, res: Response) =>
    res.status(201).json({ message: "SignIn Endpoint" }),
  signUp: (req: Request, res: Response) =>
    res.status(201).json({ message: "SignUp Endpoint" }),
  signOut: (req: Request, res: Response) =>
    res.status(201).json({ message: "SignOut Endpoint" }),
};
export default AuthController;
