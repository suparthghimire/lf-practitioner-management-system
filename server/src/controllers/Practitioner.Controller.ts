import { Request, Response } from "express";
import ErrorService from "../service/Error.Service";
import PractitionerService from "../service/Practitioner.Service";
import CONFIG from "../utils/config";
const PractitionerController = {
  index: async function (req: Request, res: Response) {
    try {
      let { pageStr, limitStr } = req.query;
      if (!pageStr) pageStr = "1";
      if (!limitStr) limitStr = "10";

      const page = parseInt(pageStr as string);
      const limit = parseInt(limitStr as string);

      const { nextPageNo, prevPageNo, totalPages, data } =
        await PractitionerService.getAllPractitioners(limit, page);

      const nextPageUrl =
        nextPageNo !== null
          ? `${CONFIG.APP_URL}/practitioners?page=${nextPageNo}&limit=${limit}`
          : undefined;
      const prevPageUrl =
        prevPageNo !== null
          ? `${CONFIG.APP_URL}/practitioners?page=${prevPageNo}&limit=${limit}`
          : undefined;

      return res.status(200).json({
        nextPageUrl,
        prevPageUrl,
        totalPages,
        data,
      });
    } catch (error) {
      console.error(error);
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Get Practitioners",
        data: data == null ? undefined : data,
      });
    }
    return res.status(200).json({ message: "Index Endpoint" });
  },
  post: (req: Request, res: Response) =>
    res.status(201).json({ message: "Post Endpoint" }),
  show: (req: Request, res: Response) =>
    res.status(200).json({ message: "Show Endpoint" }),
  update: (req: Request, res: Response) =>
    res.status(201).json({ message: "Update Endpoint" }),
  delete: (req: Request, res: Response) =>
    res.status(201).json({ message: "Delete Endpoint" }),
};
export default PractitionerController;
