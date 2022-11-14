import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { User, UserLogin, ValidateLogin, ValidateUser } from "../models/User";
import ErrorService, { CustomError } from "../service/Error.Service";
import TokenService from "../service/Token.Service";
import UserService from "../service/User.Service";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_EXPIRY,
} from "../utils/helpers";
import { JWTPayload } from "../utils/interfaces";
const AuthController = {
  index: async function (req: Request, res: Response) {
    try {
      const { userId } = req.body;
      if (!userId) throw new CustomError("Invalid Token", 401);
      const user = await UserService.getUserByID(userId);
      return res.json({
        status: true,
        data: user,
      });
    } catch (error) {}
  },
  signIn: async function (req: Request, res: Response) {
    try {
      const body = req.body;
      const loginData: UserLogin = body;
      ValidateLogin(loginData);
      const userId = await UserService.getUserIDByEmailPwd(
        loginData.email,
        loginData.password
      );

      const tokenPayload: JWTPayload = {
        id: userId,
      };
      const accessToken = TokenService.createToken(
        tokenPayload,
        ACCESS_TOKEN_EXPIRY
      );
      const refreshToken = TokenService.createToken(
        tokenPayload,
        REFRESH_TOKEN_EXPIRY
      );
      TokenService.saveUserToken(refreshToken, userId, REFRESH_TOKEN_EXPIRY);
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, `Bearer ${refreshToken}`, {
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRY * 1000,
      });

      return res.status(201).json({
        status: true,
        message: "SignIn Successful",
        data: {
          accessToken: "Bearer " + accessToken,
          refreshToken: "Bearer " + refreshToken,
        },
      });
    } catch (error) {
      console.error(error);
      const { message, data, status } = ErrorService.handleError(error, "User");
      return res.status(status || 500).json({
        status: false,
        message: message || "SignIn Failed",
        data: data == null ? undefined : data,
      });
    }
  },
  signUp: async function (req: Request, res: Response) {
    try {
      const body = req.body;
      const user: User = body;
      ValidateUser(user);
      const createdUser = await UserService.createUser(user);
      return res.status(201).json({
        status: true,
        message: "SignUp Successful!",
        user: createdUser,
      });
    } catch (error) {
      console.error(error);
      const { message, data, status } = ErrorService.handleError(error, "User");
      return res.status(status || 500).json({
        status: false,
        message: message || "Signup Failed",
        data: data == null ? undefined : data,
      });
    }
  },

  signOut: (req: Request, res: Response) =>
    res.status(201).json({
      status: true,
      message: "SignOut Endpoint",
    }),
};
export default AuthController;
