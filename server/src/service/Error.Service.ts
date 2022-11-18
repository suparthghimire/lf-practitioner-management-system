import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PRISMA_ERROR_CODES } from "../utils/prisma_error_codes";

// Custom Error extends Inbuilt Error class has status property to set status code of response
export class CustomError extends Error {
  constructor(message: string, private m_status: number) {
    super(message);
    this.name = "CustomError";
  }
  get status() {
    return this.m_status;
  }
}

export class JWTError extends Error {
  constructor(message: string, private m_status: number) {
    super(message);
    this.name = "JWTError";
  }
  get status() {
    return this.m_status;
  }
}
const ErrorService = {
  // Function to handle error based on error instance
  handleError: function (error: any, entityName: string) {
    // If error is form validation error
    if (error instanceof ZodError) {
      const { handledError, status } = HandleZodError(error);
      // handledError is a flattened error object
      return {
        status,
        message: "Validation Failed",
        data: handledError,
      };
    }
    // If error is a database or Prisma Client error (Prisma is used as ORM)
    else if (error instanceof PrismaClientKnownRequestError) {
      // Prisma error returns a single message string instead of an object so data is null and message is set to error message
      const { status, message } = HandlePrismaError(error, entityName);
      return { status, message, data: null };
    } else if (error instanceof CustomError) {
      // If error is a custom error, return status and message
      return {
        status: error.status,
        message: error.message,
        data: null,
      };
    }
    // If error is not handled, return status 500 and Default Error Message
    return {
      status: 500,
      handledError: "Internal Server Error",
    };
  },
};

function HandleZodError(error: ZodError) {
  // flattens error object, based on zod error object structure documented on github at: https://github.com/colinhacks/zod#readme
  return { status: 422, handledError: error.flatten().fieldErrors };
}
function HandlePrismaError(
  error: PrismaClientKnownRequestError,
  entityName: string
) {
  // Error Codes are defined in prisma_error_codes.ts file
  console.log(
    "error.code",
    error.code,
    PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAIL
  );
  switch (error.code) {
    case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAIL:
      return {
        status: 409,
        message: `${entityName} already exists`,
      };

    case PRISMA_ERROR_CODES.DATA_VALIDATION_ERROR:
      return {
        status: 422,
        message: `Validation Failed`,
      };
    case PRISMA_ERROR_CODES.RECORD_NOT_FOUND:
      return {
        status: 404,
        message: `${entityName} not found`,
      };
    default:
      return {
        status: 409,
        message:
          "Database Error Occured while processing request. Error Code: " +
          error.code,
      };
  }
}

export default ErrorService;
