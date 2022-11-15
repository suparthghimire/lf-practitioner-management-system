import { z } from "zod";

const dayEnum = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const SpecializationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "Specialization name is required",
  }),
});

const PractitionerSchema = z.object({
  id: z.number().optional(),
  fullname: z.string().min(1, {
    message: "Practitioner fullname is required",
  }),
  email: z.string().email({
    message: "Practitioner email is not valid",
  }),
  contact: z.number().min(1, {
    message: "Practitioner Contact is required",
  }),
  dob: z.date({
    errorMap: (err) => {
      return {
        message: "Practitioner date of birth is required",
      };
    },
  }),
  address: z.string().min(1, {
    message: "Practitioner address is required",
  }),
  image: z.string().url({
    message: "Practitioner image Url is not valid",
  }),
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
        message: "Start time is required",
      };
    },
  }),
  endTime: z.date({
    errorMap: (err) => {
      return {
        message: "End time is required",
      };
    },
  }),
  WorkingDays: z
    .array(
      z.enum(dayEnum, {
        errorMap: (err) => {
          return {
            message: "Please select a valid day",
          };
        },
      })
    )
    .nonempty({
      message: "Please select at least one day",
    }),
  Specializations: z.array(SpecializationSchema).optional(),
});

export type Practitioner = z.infer<typeof PractitionerSchema>;
export const ValidatePractitioner = (practitioner: Practitioner) => {
  try {
    PractitionerSchema.parse(practitioner);
  } catch (error) {
    throw error;
  }
};
