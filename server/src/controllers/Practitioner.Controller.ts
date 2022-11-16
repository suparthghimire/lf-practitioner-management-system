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
  // fetch all practitioners
  index: async function (req: Request, res: Response) {
    try {
      // Query Params for Offset Pagination
      let { pageStr, limitStr } = req.query;

      // Assign Default Values if query is empty
      if (!pageStr) pageStr = "1";
      if (!limitStr) limitStr = "10";

      const page = parseInt(pageStr as string);
      const limit = parseInt(limitStr as string);

      //  Gets all practitioners based on pagination query provided
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

      // Handle Error
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
  // Get All Practitioners
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

      // Upload Image to Firebase Bucket
      const imageUrl = await FileUploadService.upload(
        image as UploadedFile,
        imageName
      );

      // set image url returned from upload function
      practitioner.image = imageUrl;

      // Create Practitioner
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
  // Get Practitioner by ID
  show: async function (req: Request, res: Response) {
    try {
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

      // if practitioner is not found, throw Validation Error (Practitioner not found)
      if (!practitioner)
        throw new PrismaClientKnownRequestError(
          "",
          PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          ""
        );
      // return success
      return res.status(200).json({ message: "Show Endpoint" });
    } catch (error) {
      console.error(error);
      // Handle Error
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      // return failure
      return res.status(status || 500).json({
        status: false,
        message: message || "Failed to get practitioner",
        data: data == null ? undefined : data,
      });
    }
  },
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
      // if practitioner is not found, throw not found error
      if (!practitioner)
        throw new PrismaClientKnownRequestError(
          "",
          PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          ""
        );

      const body = req.body;

      let newPractitioner: Practitioner = body;

      // Sanitize Body content to match validation
      newPractitioner.dob = new Date(body.dob as string);
      newPractitioner.startTime = new Date(body.startTime as string);
      newPractitioner.endTime = new Date(body.endTime as string);
      newPractitioner.Specializations = body.Specializations;
      newPractitioner.WorkingDays = body.WorkingDays;

      // Copy old practioner data to new practitioner to get all data that is not updated
      newPractitioner = {
        ...practitioner,
        ...newPractitioner,
      };

      // If image is present, delete previous image from storage bucket and upload new image
      if (req.files && req.files.image) {
        const image = req.files.image;
        ValidateImage(image as UploadedFile);
        const imageName = uuidv4() + "--" + Date.now();

        // delete image
        const unresolvedDel = FileUploadService.delete(practitioner.image);
        // upliad iumage
        const unresolvedImgUpload = FileUploadService.upload(
          image as UploadedFile,
          imageName
        );
        // Since both operations are async and mutually exclusive, Resolve them in parallel
        const [_, imageUrl] = await Promise.all([
          unresolvedDel,
          unresolvedImgUpload,
        ]);

        // set image url returned from upload function to newPractitioner image
        newPractitioner.image = imageUrl;
      }

      // get currentWorkingDays to disconnect current relationships from practitioner
      const currWorkingDaysIdList = practitioner.WorkingDays.map(
        (day) => day.id
      );
      // get currentSpecializations to disconnect current relationships from practitioner
      const currSpecializationsIdList = practitioner.Specializations.map(
        (day) => day.id
      );

      // Validation checks for Input Sanitization and If unique constraint fails; throws ZodError if validation fails
      await ValidatePractitioner(newPractitioner);

      // Update Practitioner
      const updatedPractitioner = await PractitionerService.updatePractitioner(
        currWorkingDaysIdList,
        currSpecializationsIdList,
        newPractitioner
      );

      // return success
      return res.status(201).json({
        status: true,
        message: "Practitioner Updated",
        data: updatedPractitioner,
      });
    } catch (error) {
      console.log(error);
      // Handle Error
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      // return failure
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

      // The response from delete function is not used, so it is resolved in parallel and not awaited
      FileUploadService.delete(imageUrl);

      // Delete Practitioner
      await PractitionerService.deletePractitioner(parseInt(practitioner_id));

      // return success
      return res
        .status(201)
        .json({ message: "Practitioner deleted successfully" });
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
        message: message || "Failed to delete practitioner",
        data: data == null ? undefined : data,
      });
    }
  },
};

// Export Controller
export default PractitionerController;