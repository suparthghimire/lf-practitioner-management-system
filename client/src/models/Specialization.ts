import { z } from "zod";

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

export type Specialization = z.infer<typeof SpecializationSchema>;
export default Specialization;
