import { z } from "zod";

// This is schema for Specialization returnd by API
export const SpecializationSchema = z.object({
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

// Creates Type by infering the schema
type Specialization = z.infer<typeof SpecializationSchema>;
export default Specialization;
