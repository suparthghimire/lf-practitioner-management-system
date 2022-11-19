import { Request, Response } from "express";
import ErrorService from "../service/Error.Service";
import SpecializationService from "../service/Specialization.Service";
const SpecializationController = {
  index: async function (req: Request, res: Response) {
    try {
      const allSpecializations: any =
        await SpecializationService.getAllSpecializations();
      return res.status(200).json({
        status: true,
        message: "All Specializations",
        data: allSpecializations,
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "Spcialization"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Fetch Specializations",
        data: data == null ? undefined : data,
      });
    }
  },
};
export default SpecializationController;
