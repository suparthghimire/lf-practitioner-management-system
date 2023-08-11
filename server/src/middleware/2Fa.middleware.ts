import { ValidateTwoFaVerifyUserType } from "../models/TwoFA";
import { NextFunction, Request, Response } from "express";
import TwoFaService from "../service/TwoFA.Service";
import ErrorService from "../service/Error.Service";

const Verify2Fa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const data = ValidateTwoFaVerifyUserType(body);

    if (!data) throw data;
    await TwoFaService.verify(data);

    next();
  } catch (error) {
    console.error(error);
    // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
    const { message, data, status } = ErrorService.handleError(error, "TwoFA");
    // return failure
    return res.status(status || 500).json({
      status: false,
      message: message || "Failed to Verify 2FA Key",
      data: data == null ? undefined : data,
    });
  }
};

export default Verify2Fa;
