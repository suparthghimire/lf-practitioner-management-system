import { Request, Response } from "express";
import ErrorService from "../service/Error.Service";
import PractitionerService from "../service/Practitioner.Service";

const UserController = {
  index: async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const practitonersWorkingToday =
        await PractitionerService.getPractitionersWorkingToday(userId);

      return res.status(200).json({
        status: true,
        message: "Practitioners working today",
        data: { practitonersWorkingToday },
      });
    } catch (error) {
      console.error(error);
      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Fetch Dashboard Data",
        data: data == null ? undefined : data,
      });
    }
  },
};

export default UserController;
