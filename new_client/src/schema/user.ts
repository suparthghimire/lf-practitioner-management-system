import { z } from "zod";
// This is the schema for the user and the User Schema

export const UserLoginSchema = z.object({
  email: z.string().email({
    message: "Enter valid email",
  }),
  password: z.string().min(8, {
    message: `Password must be at least ${8} characters`,
  }),
});

export const UserSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is not valid",
    }),
    password: z.string().min(8, {
      message: `Password must be at least  characters`,
    }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type T_User = z.infer<typeof UserSchema>;

export type T_UserLogin = z.infer<typeof UserLoginSchema>;
