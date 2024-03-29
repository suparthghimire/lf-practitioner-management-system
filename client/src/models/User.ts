import { z } from "zod";
import { TwoFaSchema } from "./2Fa";

const PWD_SIZE = 8;

// This is the schema for the user and the User Schema

export const UserLoginSchema = z.object({
  email: z
    .string({
      errorMap: (err) => {
        return {
          message: "Email is required",
        };
      },
    })
    .email({
      message: "Enter valid email",
    }),
  password: z
    .string({
      errorMap: (err) => {
        return {
          message: "Password is required",
        };
      },
    })
    .min(PWD_SIZE, {
      message: `Password must be at least ${PWD_SIZE} characters`,
    }),
});

export const UserSchema = z
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
      .min(PWD_SIZE, {
        message: `Password must be at least ${PWD_SIZE} characters`,
      }),
    confirmPassword: z.string({
      errorMap: (err) => {
        return {
          message: "Confirm Password is required",
        };
      },
    }),
    UserTwoFa: TwoFaSchema.optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
    return null;
  });

export type User = z.infer<typeof UserSchema>;

export type DisplayUser = Omit<User, "password" | "confirmPassword"> & {
  createdAt: Date;
  updatedAt: Date;
};

export type UserLogin = z.infer<typeof UserLoginSchema>;
