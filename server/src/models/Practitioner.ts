import fileUpload from "express-fileupload";
import { z } from "zod";
import PractitionerService from "../service/Practitioner.Service";
import CONFIG from "../utils/app_config";

const dayEnum = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const SpecializationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "Specialization name is required",
  }),
});

const WorkingDaysSchema = z.object({
  id: z
    .number({
      errorMap: (err) => ({
        message: "Working day id must be a number",
      }),
    })
    .optional(),
  name: z.enum(dayEnum, {
    errorMap: (err) => {
      return {
        message: "Please select a valid day",
      };
    },
  }),
});

const PractitionerSchema = z
  .object({
    id: z
      .number({
        errorMap: (err) => ({
          message: "Practitioner id must be a number",
        }),
      })
      .optional(),
    fullname: z
      .string({
        errorMap: (err) => {
          return {
            message: "Practitioner fullname is required",
          };
        },
      })
      .min(1, {
        message: "Practitioner fullname is required",
      }),
    email: z
      .string({
        errorMap: (err) => {
          return {
            message: "Practitioner email is required",
          };
        },
      })
      .email({
        message: "Practitioner email is not valid",
      }),
    contact: z
      .string({
        errorMap: (err) => {
          return {
            message: "Practitioner contact is required",
          };
        },
      })
      .min(1, {
        message: "Practitioner Contact is required",
      })
      .superRefine((contact, ctx) => {
        //regex fordigit
        const regex = new RegExp(/^\d+$/);
        if (!regex.test(contact)) {
          ctx.addIssue({
            code: "custom",
            message: "Practitioner contact must be a number",
          });
        }
        return true;
      }),
    dob: z.date({
      errorMap: (err) => {
        return {
          message: "Practitioner date of birth is required",
        };
      },
    }),
    address: z
      .string({
        errorMap: (err) => {
          return {
            message: "Practitioner address is required",
          };
        },
      })
      .min(1, {
        message: "Practitioner address is required",
      }),
    image: z.string().min(0),
    ICUSpecialist: z
      .boolean({
        errorMap: (err) => {
          return {
            message: "Please select between Yes or No",
          };
        },
      })
      .optional(),
    startTime: z.date({
      errorMap: (err) => {
        return {
          message: "Start time for practitioner is required",
        };
      },
    }),
    endTime: z.date({
      errorMap: (err) => {
        return {
          message: "End time for practitioner is required",
        };
      },
    }),
    WorkingDays: z
      .array(WorkingDaysSchema, {
        errorMap: (err) => {
          return {
            message: "Working days for practitioner is required",
          };
        },
      })
      .nonempty({
        message: "Please select at least one day",
      }),
    Specializations: z.array(SpecializationSchema).optional(),
  })
  .superRefine(async (practitioner, ctx) => {
    try {
      const unresolvedEmailExist = PractitionerService.getPractitionerByEmail(
        practitioner.email
      );
      const unresolvedContactExist =
        PractitionerService.getPractitionerByContact(practitioner.contact);
      const [emailExist, contactExist] = await Promise.all([
        unresolvedEmailExist,
        unresolvedContactExist,
      ]);
      if (emailExist && practitioner.id !== emailExist.id) {
        ctx.addIssue({
          code: "custom",
          message: "Practitioner email already exist",
          path: ["email"],
        });
      }
      if (contactExist && practitioner.id !== contactExist.id) {
        ctx.addIssue({
          code: "custom",
          message: "Practitioner contact already exist",
          path: ["contact"],
        });
      }
    } catch (error) {
      throw error;
    }
  });

const ImageSchema = z.object({
  size: z.number().max(CONFIG.MAX_IMG_SIZE, {
    message: "Image size is too large",
  }),
  mimetype: z.string().superRefine((mime, ctx) => {
    if (mime !== "image/png" && mime !== "image/jpeg") {
      ctx.addIssue({
        code: "custom",
        message: "File type is not supported",
      });
    }
  }),
});

export type Practitioner = z.infer<typeof PractitionerSchema>;
export const ValidatePractitioner = async function (
  practitioner: Practitioner
) {
  try {
    await PractitionerSchema.parseAsync(practitioner);
  } catch (error) {
    throw error;
  }
};
export const ValidateImage = (image: fileUpload.UploadedFile) => {
  try {
    const obj = {
      size: image.size,
      mimetype: image.mimetype,
    };
    ImageSchema.parse({
      size: image.size,
      mimetype: image.mimetype,
    });
  } catch (error) {
    throw error;
  }
};
