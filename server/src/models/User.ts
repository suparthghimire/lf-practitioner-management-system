import { z, ZodError } from "zod";

const UserSchema = z
  .object({
    id: z.number().optional(),
    name: z
      .string({
        errorMap: (err) => {
          return {
            message: "Name is required",
          };
        },
      })
      .min(1, {
        message: "Name is required",
      }),
    email: z
      .string({
        errorMap: (err) => {
          return {
            message: "Email is required",
          };
        },
      })
      .email({
        message: "Email is not valid",
      }),
    password: z
      .string({
        errorMap: (err) => {
          return {
            message: "Password is required",
          };
        },
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
    confirmPassword: z
      .string({
        errorMap: (err) => {
          return {
            message: "Confirm Password is required",
          };
        },
      })
      .min(8),
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
