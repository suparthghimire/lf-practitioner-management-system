import { z } from "zod";
import CONFIG from "../utils/app_config";
import moment from "moment";

// Schema for Practitioner returned by API
export const PractitionerSchema = z
  .object({
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
      if (!img)
        return ctx.addIssue({
          code: "custom",
          message: "Practitioner image is required",
        });
      if (img instanceof File === true) {
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
  })
  .superRefine((practitioner, ctx) => {
    // check if end time is greater than start time

    // check in 24 hrs format

    const stGtEt = moment(practitioner.startTime).isAfter(
      moment(practitioner.endTime)
    );

    if (stGtEt)
      ctx.addIssue({
        code: "custom",
        message: "End time must be greater than start time",
        path: ["endTime"],
      });
  });

// Creates Type by infering the schema
export type Practitioner = z.infer<typeof PractitionerSchema>;
