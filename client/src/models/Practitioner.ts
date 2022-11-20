import { z } from "zod";
import CONFIG from "../utils/app_config";
import { SpecializationSchema } from "./Specialization";
import { WorkingDaysSchema } from "./WorkingDay";

export const PractitionerSchema = z.object({
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
  image: z.any().superRefine((img: File, ctx) => {
    if (img instanceof File === false)
      ctx.addIssue({
        code: "custom",
        message: "Please select a Valid Image",
        // path: ["image"],
      });
    else {
      if (img.size > CONFIG.MAX_IMG_SIZE)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Image size must be less than ${
            CONFIG.MAX_IMG_SIZE / (1024 * 1024)
          } MB`,
        });
      else {
        if (!CONFIG.IMAGE_ACCEPT_MIMES.includes(img.type))
          ctx.addIssue({
            code: "custom",
            message: `Accepted File Type is only .jpg/.jpeg and .png`,
            // path: ["image"],
          });
      }
    }
  }),
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
    .array(
      z.string({
        errorMap: (err) => {
          return {
            message: "Please select a valid day",
          };
        },
      })
    )

    .superRefine((days, ctx) => {
      if (days.length > 0) {
        days.map((d) => {
          console.log(d);
          if (d.length <= 0)
            ctx.addIssue({
              code: "custom",
              message: "Please Select or create valid Working Day",
              // path: ["WorkingDays"],
            });
        });
      } else
        ctx.addIssue({
          code: "custom",
          message: "Please Select or create atlease one Working Day",
          // path: ["WorkingDays"],
        });
    }),
  Specializations: z
    .array(
      z.string({
        errorMap: (err) => {
          return {
            message: "Specialization for practitioner is required",
          };
        },
      })
    )
    .optional(),
});

export type Practitioner = z.infer<typeof PractitionerSchema>;
