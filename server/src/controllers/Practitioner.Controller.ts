import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { ZodError } from "zod";
import {
  Practitioner,
  ValidateImage,
  ValidatePractitioner,
} from "../models/Practitioner";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import ErrorService from "../service/Error.Service";
import FileUploadService from "../service/FileUpload.Service";
import { v4 as uuidv4 } from "uuid";

import PractitionerService from "../service/Practitioner.Service";
import CONFIG from "../utils/app_config";
import { PrismaClient } from "prisma/prisma-client";
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
  },
  post: async function (req: Request, res: Response) {
    const imageName = uuidv4() + "--" + Date.now();
    try {
      const body = req.body;
      const practitioner: Practitioner = body;

      practitioner.dob = new Date(body.dob as string);
      practitioner.startTime = new Date(body.startTime as string);
      practitioner.endTime = new Date(body.endTime as string);
      practitioner.Specializations = body.Specializations
        ? body.Specializations.map((spec: { id: string; name: string }) => ({
            id: parseInt(spec.id as string),
            name: spec.name as string,
          }))
        : [];
      practitioner.WorkingDays = body.WorkingDays
        ? body.WorkingDays.map((day: { id: string; name: string }) => ({
            id: parseInt(day.id as string),
            name: day.name as string,
          }))
        : [];
      const image = req.files?.image;
      if (!image)
        throw new ZodError([
          {
            path: ["image"],
            message: "Image is required",
            code: "custom",
          },
        ]);
      practitioner.image = "";

      await ValidatePractitioner(practitioner);

      ValidateImage(image as UploadedFile);
      const imageUrl = await FileUploadService.upload(
        image as UploadedFile,
        imageName
      );
      practitioner.image = imageUrl;
      const createdPractitioner = await PractitionerService.createPractitioner(
        practitioner
      );
      return res.status(201).json({
        status: true,
        message: "Practitioner Created Successfully",
        data: createdPractitioner,
      });
    } catch (error) {
      console.error(error);
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to create practitioner",
        data: data == null ? undefined : data,
      });
    }
  },
  show: (req: Request, res: Response) =>
    res.status(200).json({ message: "Show Endpoint" }),
  update: (req: Request, res: Response) =>
    res.status(201).json({ message: "Update Endpoint" }),
  delete: async function (req: Request, res: Response) {
    try {
      const { practitioner_id } = req.params;
      if (!practitioner_id)
        throw new ZodError([
          {
            path: ["id"],
            message: "Id is required",
            code: "custom",
          },
        ]);
      const practitioner = await PractitionerService.getPractitionerById(
        parseInt(practitioner_id)
      );
      if (!practitioner)
        throw new PrismaClientKnownRequestError("", "2015", "");

      const imageUrl = decodeURI(practitioner.image);
      const deleteImageFromBucket = await FileUploadService.delete(imageUrl);
      const deletePractitioner = await PractitionerService.deletePractitioner(
        parseInt(practitioner_id)
      );

      return res
        .status(201)
        .json({ message: "Practitioner deleted successfully" });
    } catch (error) {
      console.error(error);
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to delete practitioner",
        data: data == null ? undefined : data,
      });
    }
  },
};
export default PractitionerController;
