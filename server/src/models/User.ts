import { z, ZodError } from "zod";

const UserSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is not valid",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8),
  })
  .superRefine((data) => {
    if (data.password !== data.confirmPassword) {
      return {
        code: "password_mismatch",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      };
    }
    return null;
  });

export type User = z.infer<typeof UserSchema>;

export const ValidateUser = (user: User) => {
  try {
    UserSchema.parse(user);
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
  }
};
