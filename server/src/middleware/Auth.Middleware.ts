import { Request, Response, NextFunction } from "express";
import TokenService from "../service/Token.Service";
import CONFIG from "../utils/app_config";
import { JWTPayload } from "../utils/interfaces";
import { prismaClient } from "..";
import { CustomError } from "../service/Error.Service";
import Verify2Fa from "./2Fa.middleware";

const IsLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers["authorization"] as string;

  if (!bearerToken)
    return res.status(401).json({
      status: false,
      message: "Invalid Token",
    });

  try {
    const token = bearerToken.split(" ").at(1);
    if (!token) throw new CustomError("Invalid Token", 401);
    const payload = TokenService.validateJwtToken(token) as JWTPayload;
    // find user

    const user = await prismaClient.user.findUnique({
      where: {
        id: payload.id,
      },
      include: {
        UserTwoFA: true,
      },
    });
    if (!user) throw new CustomError("User not found", 404);

    // check if user has 2fa enabled

    req.body.userId = payload.id;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid Token",
    });
  }
};

const IsLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken =
    (req.headers["authorization"] as string) ||
    (req.cookies[CONFIG.REFRESH_TOKEN_COOKIE_NAME] as string);
  if (bearerToken) {
    const token = bearerToken.split(" ")[1];
    try {
      const payload = TokenService.validateJwtToken(token) as JWTPayload;
      console.log("PAYLOAD", payload);
      return res.status(403).json({
        status: false,
        message: "Already Logged In",
      });
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};

const PractitionerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers["authorization"] as string;

  if (!bearerToken)
    return res.status(401).json({
      status: false,
      message: "Token No Invalid Token",
    });

  try {
    const token = bearerToken.split(" ").at(1);
    if (!token) throw new CustomError("Invalid Token", 401);
    const payload = TokenService.validateJwtToken(token) as JWTPayload;

    // find practitioner
    const practitioner = await prismaClient.practitioner.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!practitioner) throw new CustomError("Practitioner not found", 404);
    req.body.practitionerId = payload.id;

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid Token",
    });
  }
};
export { IsLoggedIn, IsLoggedOut, PractitionerLogin };
