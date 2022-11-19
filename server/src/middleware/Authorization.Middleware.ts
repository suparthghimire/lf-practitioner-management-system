import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import PractitionerService from "../service/Practitioner.Service";
import ErrorService, { CustomError } from "../service/Error.Service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PRISMA_ERROR_CODES } from "../utils/prisma_error_codes";

export async function HasWritePermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.body;
    const { practitioner_id } = req.params;
    if (isNaN(Number(practitioner_id)))
      throw new ZodError([
        {
          path: ["practitioner_id"],
          code: "custom",
          message: "Practitioner Id must be a number",
        },
      ]);
    const practitioner = await PractitionerService.getPractitionerById(
      parseInt(practitioner_id)
    );
    if (!practitioner)
      throw new PrismaClientKnownRequestError(
        "",
        PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
        ""
      );
    if (practitioner.createdBy.id !== parseInt(userId))
      throw new CustomError("Not Enough Privileges", 403);
    next();
  } catch (error) {
    console.error(error);
    // Handle Error
    const { message, data, status } = ErrorService.handleError(
      error,
      "Practitioner"
    );
    // return failuer
    return res.status(status || 403).json({
      status: false,
      message: message || "Permission Denied",
      data: data == null ? undefined : data,
    });
  }
}
