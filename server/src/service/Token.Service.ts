import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import moment from "moment";
import { prismaClient } from "../index";
import { CustomError } from "./Error.Service";
import { JWTPayload } from "../utils/interfaces";
import CONFIG from "../utils/app_config";
import { PRISMA_ERROR_CODES } from "../utils/prisma_error_codes";
const TokenService = {
  // creates new jwt token with payload and expiry time
  createToken: (payload: JWTPayload, expirationTime: number) => {
    return jwt.sign(payload, CONFIG.JWT_SECRET, {
      expiresIn: expirationTime,
    });
  },
  // validates the token and returns the payload
  validateJwtToken: (token: string) => {
    try {
      return jwt.verify(token, CONFIG.JWT_SECRET);
    } catch (error) {
      throw new CustomError("Invalid Token", 401);
    }
  },
  // gets token of user that is saved in database
  getUserToken: async (token: string) => {
    try {
      const userToken = await prismaClient.refreshToken.findUnique({
        where: {
          token,
        },
        include: {
          user: true,
        },
      });
      return userToken;
    } catch (error) {
      throw error;
    }
  },
  // Verifies if the token belongs to the user
  verifyUserToken: async (token: string) => {
    try {
      const decoded = TokenService.validateJwtToken(token);
      const user = await prismaClient.user.findUnique({
        where: {
          id: (decoded as JWTPayload).id,
        },
      });
      if (!user)
        throw new PrismaClientKnownRequestError(
          "",
          PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          ""
        );
      return user;
    } catch (error) {
      throw error;
    }
  },
  // saves the token of that user in database
  saveUserToken: async function (
    token: string,
    userId: number,
    expireTimeInSec: number
  ) {
    try {
      // remove all previous tokens for the user
      const delPromise = prismaClient.refreshToken.deleteMany({
        where: {
          userId,
        },
      });
      const userPromise = prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      const [_, user] = await Promise.all([delPromise, userPromise]);
      if (!user)
        throw new PrismaClientKnownRequestError(
          "",
          PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          ""
        );
      const expureTime = moment().add(expireTimeInSec, "seconds").toDate();
      await prismaClient.refreshToken.create({
        data: {
          token,
          expireTime: expureTime,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },
  // removes the token of that user from database
  removeUserToken: async function (userId: number) {
    try {
      await prismaClient.refreshToken.deleteMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
export default TokenService;
