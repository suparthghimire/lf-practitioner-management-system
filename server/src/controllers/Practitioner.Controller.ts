import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { ZodError } from "zod";
import {
  Practitioner,
  ValidateImage,
  ValidatePractitioner,
} from "../models/Practitioner";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import ErrorService, { CustomError } from "../service/Error.Service";
import FileUploadService from "../service/FileUpload.Service";
import { v4 as uuidv4 } from "uuid";

import PractitionerService from "../service/Practitioner.Service";
import CONFIG from "../utils/app_config";
import { PRISMA_ERROR_CODES } from "../utils/prisma_error_codes";
import { GetPagination } from "../utils/helpers";
import TokenService from "../service/Token.Service";
import { JWTPayload } from "../utils/interfaces";
import { UserLogin, ValidateLogin } from "../models/User";
import TwoFaService from "../service/TwoFA.Service";
import moment from "moment";
import { DayName } from "@prisma/client";
import AttendanceService from "../service/Attendance.Service";

const PractitionerController = {
  // fetch all practitioners
  index: async function (req: Request, res: Response) {
    try {
      // Query Params for Offset Pagination
      let { page: pageStr, limit: limitStr } = req.query;

      const { userId } = req.body;
      console.log(userId);

      // Assign Default Values if query is empty
      if (!pageStr) pageStr = "1";
      if (!limitStr) limitStr = "10";

      const page = parseInt(pageStr as string);
      const limit = parseInt(limitStr as string);

      //  Gets all practitioners based on pagination query provided
      const { data, totalData } = await PractitionerService.getAllPractitioners(
        limit,
        page,
        userId
      );

      const { nextPageNo, prevPageNo, totalPages } = GetPagination(
        page,
        limit,
        totalData
      );
      /**
       * If next page or previous page isnt available, URL isnt created and it isnt returned in response
       */

      // Create URL for next page
      const nextPageUrl =
        nextPageNo !== null
          ? `${CONFIG.APP_URL}/practitioner?page=${nextPageNo}&limit=${limit}`
          : undefined;
      // Create URL for Previous page
      const prevPageUrl =
        prevPageNo !== null
          ? `${CONFIG.APP_URL}/practitioner?page=${prevPageNo}&limit=${limit}`
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

      if (!body.userId) throw new CustomError("Please Login to Continue", 401);
      if (isNaN(parseInt(body.userId)))
        throw new CustomError("Invalid User", 401);

      // Sanitize Body content to match validation
      practitioner.dob = new Date(body.dob as string);
      practitioner.startTime = new Date(body.startTime as string);
      practitioner.endTime = new Date(body.endTime as string);
      practitioner.icuSpecialist = body.icuSpecialist
        ? body.icuSpecialist === "true"
        : false;
      practitioner.createdBy = parseInt(body.userId);

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
      console.log("VALIUDATION");
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

      console.log("FILE UPLOAD");

      // set image url returned from upload function
      practitioner.image = imageUrl;

      // Create Practitioner
      const createdPractitioner = await PractitionerService.createPractitioner(
        practitioner
      );

      // after creating, see if practitioner is working today. if yes, create an attendance for practitioner
      const todayDayName = moment().format("dddd") as DayName;

      const isWorkingToday = practitioner.WorkingDays.some(
        (day) => day.day === todayDayName
      );

      if (isWorkingToday) {
        console.log("WOEKING TODAY");
        await AttendanceService.create(new Date(), createdPractitioner.id);
      }
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
      // check if id is a number. If not, throw error
      if (isNaN(parseInt(practitioner_id)))
        throw new ZodError([
          {
            path: ["id"],
            message: "Practitioner id must be a number",
            code: "custom",
          },
        ]);
      // Get practitioner from database
      const practitioner = await PractitionerService.getPractitionerById(
        parseInt(practitioner_id)
      );

      // if practitioner is not found, throw Validation Error (Practitioner not found)
      if (!practitioner)
        throw new PrismaClientKnownRequestError("", {
          code: PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          clientVersion: "2.24.1",
        });
      // return success
      return res.status(200).json({ status: true, data: practitioner });
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
      // check if id is a number. If not, throw error
      if (isNaN(parseInt(practitioner_id)))
        throw new ZodError([
          {
            code: "custom",
            message: "Practitioner Id must be a number",
            path: ["practitioner_id"],
          },
        ]);

      const practitioner = await PractitionerService.getPractitionerById(
        parseInt(practitioner_id)
      );
      // if practitioner is not found, throw not found error
      if (!practitioner)
        throw new PrismaClientKnownRequestError("", {
          code: PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          clientVersion: "2.24.1",
        });

      const body = req.body;
      const { userId } = body;

      let newIcuSpecialist = practitioner.icuSpecialist;
      if (body.icuSpecialist !== undefined) {
        if (typeof body.icuSpecialist === "string") {
          newIcuSpecialist = body.icuSpecialist === "true";
        } else if (typeof body.icuSpecialist === "boolean") {
          newIcuSpecialist = body.icuSpecialist;
        }
      }

      let newPractitioner: Practitioner = body;
      // Sanitize Body content to match validation
      newPractitioner.dob = body.dob
        ? new Date(body.dob as string)
        : practitioner.dob;
      newPractitioner.startTime = body.startTime
        ? new Date(body.startTime as string)
        : practitioner.startTime;
      newPractitioner.endTime = body.endTime
        ? new Date(body.endTime as string)
        : practitioner.endTime;
      newPractitioner.Specializations = body.Specializations
        ? body.Specializations
        : practitioner.Specializations;

      newPractitioner.icuSpecialist = newIcuSpecialist;

      newPractitioner.WorkingDays = body.WorkingDays
        ? body.WorkingDays
        : practitioner.WorkingDays;

      newPractitioner.createdBy = parseInt(userId);

      if (newPractitioner.icuSpecialist === undefined)
        newPractitioner.icuSpecialist = practitioner.icuSpecialist;

      // Copy old practioner data to new practitioner to get all data that  does not need to be updated
      newPractitioner = {
        ...practitioner,
        ...newPractitioner,
      };

      // If image is present, delete previous image from storage bucket and upload new image
      if (req.files && req.files.image) {
        const image = req.files.image;
        ValidateImage(image as UploadedFile);
        const imageName = uuidv4() + "--" + Date.now();

        // Since we dont care about the previous image, we can delete it without waiting for it to finish
        FileUploadService.delete(practitioner.image);

        // upliad iumage
        const imageUrl = await FileUploadService.upload(
          image as UploadedFile,
          imageName
        );
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

      const todayDayName = moment().format("dddd") as DayName;

      const isWorkingToday = practitioner.WorkingDays.some(
        (day) => day.day === todayDayName
      );

      if (isWorkingToday) {
        console.log("WOEKING TODAY");
        await AttendanceService.create(new Date(), updatedPractitioner.id);
      }
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
      if (isNaN(parseInt(practitioner_id)))
        throw new ZodError([
          {
            path: ["id"],
            message: "Invalid Practitioner id",
            code: "custom",
          },
        ]);
      // if practitioner id is not present, throw Validation Error (id is required)
      if (!practitioner_id)
        throw new ZodError([
          {
            path: ["id"],
            message: "Practitioner id is required",
            code: "custom",
          },
        ]);
      if (isNaN(parseInt(practitioner_id)))
        throw new ZodError([
          {
            code: "custom",
            message: "Practitioner Id must be a number",
            path: ["practitioner_id"],
          },
        ]);

      // Get practitioner from database
      const practitioner = await PractitionerService.getPractitionerById(
        parseInt(practitioner_id)
      );
      // if practitioner is not found, throw Not found error to client
      if (!practitioner)
        throw new PrismaClientKnownRequestError("", {
          code: PRISMA_ERROR_CODES.RECORD_NOT_FOUND,
          clientVersion: "2.24.1",
        });
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
  login: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const loginData: UserLogin = body;

      // Validate User Credentials
      ValidateLogin(loginData);

      const practitioner = await PractitionerService.authenticate(
        loginData.email,
        loginData.password
      );

      /**
       * Get practitioner data from database basedo on email and password
       * If practitioner is not found, throws error of Invalid Credentials
       * else returns userid
       */
      // check if 2fa

      if (
        practitioner.PractitionerTwoFA &&
        practitioner.PractitionerTwoFA.verified
      ) {
        if (!loginData.token)
          throw new ZodError([
            {
              code: "custom",
              message: "Invalid 2FA token",
              path: ["token"],
            },
          ]);
        // check if 2fa is verified. If not, this throws error
        await TwoFaService.verify({
          email: loginData.email,
          password: loginData.password,
          secret: practitioner.PractitionerTwoFA.secret,
          token: loginData.token,
          type: "practitioner",
        });
      } else {
        console.log("2fa not enabled");
      }

      // Create Payload for JWT Token
      const tokenPayload: JWTPayload = {
        id: practitioner.id,
      };

      // Generate Token for access token with some expiration time (Set in Config File)
      const accessToken = TokenService.createToken(
        tokenPayload,
        CONFIG.ACCESS_TOKEN_EXPIRY
      );

      // return success
      return res.status(201).json({
        status: true,
        message: "SignIn Successful",
        data: {
          practitioner: practitioner,
          accessToken: "Bearer " + accessToken,
        },
      });
    } catch (error) {
      console.error(error);
      // Handle Error
      const { message, data, status } = ErrorService.handleError(
        error,
        "Practitioner"
      );
      // return failuer
      return res.status(status || 500).json({
        status: false,
        message: message || "SignIn Failed",
        data: data == null ? undefined : data,
      });
    }
  },
};

// Export Controller
export default PractitionerController;
