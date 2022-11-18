import { z } from "zod";
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
  id: z
    .number({
      errorMap: (err) => {
        return {
          message: "Enter a Valid Specialization id",
        };
      },
    })
    .optional(),
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
  day: z.enum(dayEnum, {
    errorMap: (err) => {
      return {
        message: "Please select a valid day",
      };
    },
  }),
});

const PractitionerSchema = z.object({
  id: z
    .number({
      errorMap: (err) => ({
        message: "Practitioner id must be a number",
      }),
    })
    .optional(),
  createdBy: z.number({
    errorMap: (err) => ({
      message: "Created by must be a number",
    }),
  }),
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
  icuSpecialist: z
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
export const ValidateImage = (image: File) => {
  try {
    ImageSchema.parse({
      size: image.size,
      mimetype: image.type,
    });
  } catch (error) {
    throw error;
  }
};
