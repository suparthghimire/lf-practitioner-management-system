import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/helpers";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import moment from "moment";
import { prismaClient } from "../index";
import { CustomError } from "./Error.Service";
import { JWTPayload } from "../utils/interfaces";
const TokenService = {
  createToken: (payload: JWTPayload, expirationTime: number) => {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: expirationTime,
    });
  },
  validateJwtToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new CustomError("Invalid Token", 401);
    }
  },
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
  verifyUserToken: async (token: string) => {
    try {
      const decoded = TokenService.validateJwtToken(token);
      const user = await prismaClient.user.findUnique({
        where: {
          id: (decoded as JWTPayload).id,
        },
      });
      if (!user) throw new PrismaClientKnownRequestError("", "2015", "");
      return user;
    } catch (error) {
      throw error;
    }
  },
  saveUserToken: async function (
    token: string,
    userId: number,
    expireTimeInSec: number
  ) {
    try {
      // remove all token for the user
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
      if (!user) throw new PrismaClientKnownRequestError("", "2015", "");
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
