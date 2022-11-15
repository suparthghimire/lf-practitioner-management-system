import { z } from "zod";
const PWD_SIZE = 8;
const UserLoginSchema = z.object({
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
export type UserLogin = z.infer<typeof UserLoginSchema>;
export const ValidateUser = (user: User) => {
  try {
    UserSchema.parse(user);
  } catch (error) {
    throw error;
  }
};

export const ValidateLogin = (user: UserLogin) => {
  try {
    UserLoginSchema.parse(user);
  } catch (error) {
    throw error;
  }
};
