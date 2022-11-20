import { Day } from "prisma/prisma-client";
import { Request, Response } from "express";
import ErrorService from "../service/Error.Service";
import WorkingDayService from "../service/WorkingDay.Service";
const WorkingDayController = {
  index: async function (req: Request, res: Response) {
    try {
      const allWorkingDays: Day[] = await WorkingDayService.getAllWorkingDays();
      return res.status(200).json({
        status: true,
        message: "All Working Days",
        data: allWorkingDays,
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
        message: message || "Failed to Fetch Working Days",
        data: data == null ? undefined : data,
      });
    }
  },
};
export default WorkingDayController;
