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
import { PRISMA_ERROR_CODES } from "../utils/prisma_error_codes";
const PractitionerController = {
  index: async function (req: Request, res: Response) {
    try {
      // Query Params for Offset Pagination
      let { pageStr, limitStr } = req.query;

      // Assign Default Values if query is empty
      if (!pageStr) pageStr = "1";
      if (!limitStr) limitStr = "10";

      const page = parseInt(pageStr as string);
      const limit = parseInt(limitStr as string);

      /*
       * PractitionerService is responsible for Handeling Database operations on Practitioner Entity
       * Gets all practitioners based on pagination provided
       */
      const { nextPageNo, prevPageNo, totalPages, data } =
        await PractitionerService.getAllPractitioners(limit, page);

      /**
       * If next page or previous page isnt available, URL isnt created and it isnt returned in response
       */

      // Create URL for next page
      const nextPageUrl =
        nextPageNo !== null
          ? `${CONFIG.APP_URL}/practitioners?page=${nextPageNo}&limit=${limit}`
          : undefined;
      // Create URL for Previous page
      const prevPageUrl =
        prevPageNo !== null
          ? `${CONFIG.APP_URL}/practitioners?page=${prevPageNo}&limit=${limit}`
          : undefined;

      // Return success
      return res.status(200).json({
        nextPageUrl,
        prevPageUrl,
        totalPages,
        data,
      });
    } catch (error) {
      console.error(error);

      // Error Service handles Error based on Error Instance (ZodError, PrismaClientError, etc)
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );

      // Return Failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Get Practitioners",
        data: data == null ? undefined : data,
      });
    }
  },
  post: async function (req: Request, res: Response) {
    try {
      const body = req.body;
      const practitioner: Practitioner = body;
      // Sanitize Body content to match validation
      practitioner.dob = new Date(body.dob as string);
      practitioner.startTime = new Date(body.startTime as string);
      practitioner.endTime = new Date(body.endTime as string);

      // Check if image exist
      const image = req.files?.image;
      if (!image)
        // If not, throw Validation Error (Image is Required)
        throw new ZodError([
          {
            path: ["image"],
            message: "Image is required",
            code: "custom",
          },
        ]);

      //Set image as emopty to satisfy validation as it will be set later on after file is saved to firebase bucket
      practitioner.image = "";

      // Validation checks for Input Sanitization and If unique constraint fails; throws ZodError if validation fails
      await ValidatePractitioner(practitioner);

      // Validation for Image Size and Mimietype; throws ZodError if validation fails
      ValidateImage(image as UploadedFile);

      // Generate unique name for image
      const imageName =
        uuidv4() + "--" + Date.now() + "--" + (image as UploadedFile).name;

      // FileUpload Service is responsible for firebase bucked file handling
      const imageUrl = await FileUploadService.upload(
        image as UploadedFile,
        imageName
      );

      // set image url returned from upload function
      practitioner.image = imageUrl;

      //PractitionerService is responsible for Handeling Database operations on Practitioner Entity
      const createdPractitioner = await PractitionerService.createPractitioner(
        practitioner
      );
      // return success
      return res.status(201).json({
        status: true,
        message: "Practitioner Created Successfully",
        data: createdPractitioner,
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
        message: message || "Failed to create practitioner",
        data: data == null ? undefined : data,
      });
    }
  },
  show: (req: Request, res: Response) =>
    res.status(200).json({ message: "Show Endpoint" }),
  update: async function (req: Request, res: Response) {
    try {
      const { practitioner_id } = req.params;
      if (!practitioner_id)
        throw new ZodError([
          {
            code: "custom",
            message: "Practitioner Id is required",
            path: ["practitioner_id"],
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

      const body = req.body;
      let newPractitioner: Practitioner = body;

      newPractitioner.dob = new Date(body.dob as string);
      newPractitioner.startTime = new Date(body.startTime as string);
      newPractitioner.endTime = new Date(body.endTime as string);
      newPractitioner.Specializations = body.Specializations
        ? body.Specializations.map((spec: { id: string; name: string }) => ({
            id: parseInt(spec.id as string),
            name: spec.name as string,
          }))
        : practitioner.Specializations;
      newPractitioner.WorkingDays = body.WorkingDays
        ? body.WorkingDays.map((day: { id: string; name: string }) => ({
            id: parseInt(day.id as string),
            name: day.name as string,
          }))
        : practitioner.WorkingDays;

      newPractitioner = {
        ...practitioner,
        ...newPractitioner,
      };
      if (req.files?.image) {
        const image = req.files?.image;
        ValidateImage(image as UploadedFile);
        const imageName = uuidv4() + "--" + Date.now();

        const unresolvedDel = FileUploadService.delete(practitioner.image);
        const unresolvedImgUpload = FileUploadService.upload(
          image as UploadedFile,
          imageName
        );
        const [_, imageUrl] = await Promise.all([
          unresolvedDel,
          unresolvedImgUpload,
        ]);

        newPractitioner.image = imageUrl;
      }
      const currWorkingDaysIdList = practitioner.WorkingDays.map(
        (day) => day.id
      );
      const currSpecializationsIdList = practitioner.Specializations.map(
        (day) => day.id
      );
      console.log(newPractitioner);

      ValidatePractitioner(newPractitioner);

      const updatedPractitioner = await PractitionerService.updatePractitioner(
        currWorkingDaysIdList,
        currSpecializationsIdList,
        newPractitioner
      );

      return res.status(201).json({
        status: true,
        message: "Practitioner Updated",
        data: updatedPractitioner,
      });
    } catch (error) {
      console.log(error);
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to Update practitioner",
        data: data == null ? undefined : data,
      });
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      // get practitioner id from request parameter
      const { practitioner_id } = req.params;

      // if practitioner id is not present, throw Validation Error (id is required)
      if (!practitioner_id)
        throw new ZodError([
          {
            path: ["id"],
            message: "Practitioner id is required",
            code: "custom",
          },
        ]);

      // Get practitioner from database
      const practitioner = await PractitionerService.getPractitionerById(
        parseInt(practitioner_id)
      );
      // if practitioner is not found, throw Not found error to client
      if (!practitioner)
        throw new PrismaClientKnownRequestError(
          "",
          PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          ""
        );

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
