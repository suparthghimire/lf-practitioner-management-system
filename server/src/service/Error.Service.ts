import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export class CustomError extends Error {
  constructor(message: string, private m_status: number) {
    super(message);
    this.name = "CustomError";
  }
  get status() {
    return this.m_status;
  }
}

const ErrorService = {
  handleError: function (error: any, entityName: string) {
    if (error instanceof ZodError) {
      const { handledError, status } = HandleZodError(error);
      return {
        status,
        message: "Validation Failed",
        data: handledError,
      };
    } else if (error instanceof PrismaClientKnownRequestError) {
      const { status, message } = HandlePrismaError(error, entityName);
      return { status, message, data: null };
    } else if (error instanceof CustomError) {
      return {
        status: error.status,
        message: error.message,
        data: null,
      };
    }
    return {
      status: 500,
      handledError: "Internal Server Error",
    };
  },
};

function HandleZodError(error: ZodError) {
  return { status: 422, handledError: error.flatten().fieldErrors };
}
function HandlePrismaError(
  error: PrismaClientKnownRequestError,
  entityName: string
) {
  switch (error.code) {
    case "P2002":
      return {
        status: 409,
        message: `${entityName} already exists`,
      };

    case "2007":
      return {
        status: 422,
        message: `Validation Failed`,
      };
    case "2015":
      return {
        status: 404,
        message: `${entityName} not found`,
      };

    default:
      return {
        status: 409,
        message: "Unknown Error Occured while processing request",
      };
  }
}
export default ErrorService;
