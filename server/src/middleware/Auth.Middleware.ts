import { Request, Response, NextFunction } from "express";
import TokenService from "../service/Token.Service";
import { REFRESH_TOKEN_COOKIE_NAME } from "../utils/helpers";
import { JWTPayload } from "../utils/interfaces";

const IsLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers["authorization"] as string;
  if (!bearerToken)
    return res.status(401).json({
      status: false,
      message: "Invalid Token",
    });

  const token = bearerToken.split(" ")[1];
  try {
    const payload = TokenService.validateJwtToken(token) as JWTPayload;
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
    (req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string);
  if (bearerToken) {
    const token = bearerToken.split(" ")[1];
    try {
      const payload = TokenService.validateJwtToken(token) as JWTPayload;
      return res.status(401).json({
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

export { IsLoggedIn, IsLoggedOut };
