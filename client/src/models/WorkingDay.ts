import { z } from "zod";

const dayEnum = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// This is the schema Working Day, Returned By API

export const WorkingDaysSchema = z.object({
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

// Creates Type by infering the schema
type WorkingDay = z.infer<typeof WorkingDaysSchema>;
export default WorkingDay;
