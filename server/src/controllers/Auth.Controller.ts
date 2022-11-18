import { Request, Response } from "express";
import { User, UserLogin, ValidateLogin, ValidateUser } from "../models/User";
import ErrorService, { CustomError } from "../service/Error.Service";
import TokenService from "../service/Token.Service";
import UserService from "../service/User.Service";
import CONFIG from "../utils/app_config";
import { JWTPayload } from "../utils/interfaces";

const AuthController = {
  // get my data from token
  index: async function (req: Request, res: Response) {
    try {
      const { userId } = req.body;
      // uf userId is not send to body from Middleware, throw error of Invalid Token
      if (!userId) throw new CustomError("Invalid Token", 401);

      // Fetvh Single User
      const user = await UserService.getUserByID(userId);

      // return success
      return res.json({
        status: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      // handle Error
      const { message, data, status } = ErrorService.handleError(error, "User");
      return res.status(status || 500).json({
        status: false,
        message: message || "SignIn Failed",
        data: data == null ? undefined : data,
      });
    }
  },
  signIn: async function (req: Request, res: Response) {
    try {
      const body = req.body;
      const loginData: UserLogin = body;

      // Validate User Credentials
      ValidateLogin(loginData);

      /**
       * Get user data from database basedo on email and password
       * If user is not found, throws error of Invalid Credentials
       * else returns userid
       */
      const user = await UserService.getUserByEmailPwd(
        loginData.email,
        loginData.password
      );

      // Create Payload for JWT Token
      const tokenPayload: JWTPayload = {
        id: user.id,
      };

      // Generate Token for access token with some expiration time (Set in Config File)
      const accessToken = TokenService.createToken(
        tokenPayload,
        CONFIG.ACCESS_TOKEN_EXPIRY
      );

      // Generate Token for refresh token with some  expiration time (Set in Config File)
      const refreshToken = TokenService.createToken(
        tokenPayload,
        CONFIG.REFRESH_TOKEN_EXPIRY
      );

      /*
       * Save Refresh token to database
       * The function doesnt return anything,
       * so it is not awaited
       */
      TokenService.saveUserToken(
        refreshToken,
        user.id,
        CONFIG.REFRESH_TOKEN_EXPIRY
      );

      // Set Refresh token to user cookie
      res.cookie(CONFIG.REFRESH_TOKEN_COOKIE_NAME, `Bearer ${refreshToken}`, {
        httpOnly: true,
        maxAge: CONFIG.REFRESH_TOKEN_EXPIRY * 1000,
      });

      /**
       * Access Token isnt saved to cookie because
       * it is safer to maintain it in client side application state
       */

      // return success
      return res.status(201).json({
        status: true,
        message: "SignIn Successful",
        data: {
          user: user,
          accessToken: "Bearer " + accessToken,
          refreshToken: "Bearer " + refreshToken,
        },
      });
    } catch (error) {
      console.error(error);
      // Handle Error
      const { message, data, status } = ErrorService.handleError(error, "User");
      // return failuer
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

      // Validate Signup data
      ValidateUser(user);

      /**
       * Create New User
       * If user email exists, throws error of Email already exists
       */
      const createdUser = await UserService.createUser(user);

      // return success
      return res.status(201).json({
        status: true,
        message: "SignUp Successful!",
        user: createdUser,
      });
    } catch (error) {
      console.error(error);
      // Handle Error
      const { message, data, status } = ErrorService.handleError(error, "User");
      // return failuer
      return res.status(status || 500).json({
        status: false,
        message: message || "Signup Failed",
        data: data == null ? undefined : data,
      });
    }
  },

  signOut: function (req: Request, res: Response) {
    try {
      res.cookie(CONFIG.REFRESH_TOKEN_COOKIE_NAME, "", {
        httpOnly: true,
        maxAge: 1,
      });

      const { userId } = req.body;
      if (!userId)
        return res.status(201).json({
          status: true,
          message: "User Signed Out",
        });
      /**
       * Delete Refresh Token from database of the user
       * The function doesnt return anything,
       * so it is not awaited
       */
      TokenService.removeUserToken(userId);
      // Clear Refresh Token Cookie
      // return success
      return res.status(201).json({
        status: true,
        message: "User Signed Out",
      });
    } catch (error) {
      console.error(error);
      // Handle Error
      const { message, data, status } = ErrorService.handleError(error, "User");
      // return failuer
      return res.status(status || 500).json({
        status: false,
        message: message || "Signup Failed",
        data: data == null ? undefined : data,
      });
    }
  },
  refreshToken: async function (req: Request, res: Response) {
    try {
      // Get Refresh Token from Cookie
      let bearerToken =
        req.cookies[CONFIG.REFRESH_TOKEN_COOKIE_NAME] ||
        req.headers["authorization"];

      // If Refresh Token is not present, throw error of Invalid Token
      if (!bearerToken) throw new CustomError("Invalid Token", 401);

      const refreshToken = bearerToken.split(" ")[1];
      // Verify Refresh Token
      const { id } = TokenService.validateJwtToken(refreshToken) as JWTPayload;

      // Get Refresh Token from database
      const token = await TokenService.getUserToken(refreshToken);

      // If Refresh Token is not present in database, throw error of Invalid Token
      if (!token) throw new CustomError("Invalid Token", 401);

      // check if roken has expired
      if (token.expireTime < new Date())
        throw new CustomError("Invalid Token", 401);

      // Create Payload for JWT Token
      const tokenPayload: JWTPayload = {
        id,
      };

      // Generate Token for access token with some expiration time (Set in Config File)
      const accessToken = TokenService.createToken(
        tokenPayload,
        CONFIG.ACCESS_TOKEN_EXPIRY
      );

      // return success
      return res.status(201).json({
        status: true,
        message: "Refresh Token Successful",
        data: {
          accessToken: "Bearer " + accessToken,
          bearerToken,
        },
      });
    } catch (error) {
      console.error(error);
      // Handle Error
      const { message, data, status } = ErrorService.handleError(error, "User");
      // return failuer
      return res.status(status || 500).json({
        status: false,
        message: message || "Signup Failed",
        data: data == null ? undefined : data,
      });
    }
  },
};
export default AuthController;
