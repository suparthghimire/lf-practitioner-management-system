import { Request, Response } from "express";
import ErrorService from "../service/Error.Service";
import {
  T_TwoFaUserType,
  ValidateTwoFaGenerateUserType,
  ValidateTwoFaVerifyUserType,
} from "../models/TwoFA";
import TwoFaService from "../service/TwoFA.Service";
const TwoFAController = {
  generate: async (req: Request, res: Response) => {
    try {
      const rawBody = req.body;
      const body = {
        ...rawBody,
        type: "user",
      };
      const data = ValidateTwoFaGenerateUserType(body);

      if (!data) throw data;

      const generatedData = await TwoFaService.generate(data);

      return res.status(201).json({
        status: true,
        message: "Generated 2FA Key",
        data: generatedData,
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "TwoFA"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Generate 2FA Key",
        data: data == null ? undefined : data,
      });
    }
  },

  verify: async (req: Request, res: Response) => {
    try {
      const rawBody = req.body;
      const body = {
        ...rawBody,
        type: "user",
      };
      const data = ValidateTwoFaVerifyUserType(body);

      if (!data) throw data;
      const twoFa = await TwoFaService.verify(data);

      return res.status(201).json({
        status: true,
        message: "Verified 2FA Key",
        data: twoFa,
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "TwoFA"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Verify 2FA Key",
        data: data == null ? undefined : data,
      });
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const data = ValidateTwoFaGenerateUserType(body);

      if (!data) throw data;
      await TwoFaService.delete(data);

      return res.status(201).json({
        status: true,
        message: "Removed 2FA",
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "TwoFA"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Verify 2FA Key",
        data: data == null ? undefined : data,
      });
    }
  },
};

export default TwoFAController;
