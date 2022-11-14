import { ZodError } from "zod";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime";
const ErrorService = {
  handleError: function (error: any, entityName: string) {
    if (error instanceof ZodError) {
      const { handledError, status } = HandleZodError(error);
      return {
        status,
        handledError,
      };
    } else if (error instanceof PrismaClientKnownRequestError) {
      return HandlePrismaError(error, entityName);
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
        handledError: `${entityName} already exists`,
      };

    case "2007":
      return {
        status: 422,
        handledError: `Validation Failed`,
      };
    case "2015":
      return {
        status: 404,
        handledError: `Validation Failed`,
      };

    default:
      return {
        status: 409,
        handledError: "Unknown Error Occured while processing request",
      };
  }
}
export default ErrorService;
