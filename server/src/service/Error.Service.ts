import { ZodError } from "zod";

const ErrorService = {
  handleError: function (error: any) {
    if (error instanceof ZodError) {
      const { handledError, status } = HandleZodError(error);
      return {
        status,
        handledError,
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
export default ErrorService;
