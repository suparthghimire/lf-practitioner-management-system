import { ZodError, z } from "zod";

// twp schema types
// if type is user, then it must have userId
// if type is practitioner, then it must have practitionerId

const TwoFAPracGenerateSchema = z.object({
  type: z.literal("practitioner"),
  email: z.string(),
  password: z.string(),
});

const TwoFAUserGenerateSchema = z.object({
  type: z.literal("user"),
  email: z.string(),
  password: z.string(),
});

const TwoFAPracVerifySchema = z.object({
  type: z.literal("practitioner"),
  secret: z.string(),
  token: z.string(),
  email: z.string(),
  password: z.string(),
});

const TwoFAUserVerifySchema = z.object({
  type: z.literal("user"),
  secret: z.string(),
  token: z.string(),
  email: z.string(),
  password: z.string(),
});

type T_TwoFAGeneratePrac = z.infer<typeof TwoFAPracGenerateSchema>;

type T_TwoFAGenerateUser = z.infer<typeof TwoFAUserGenerateSchema>;
type T_TwoFaVerifyPrac = z.infer<typeof TwoFAPracVerifySchema>;

type T_TwoFaVerifyUser = z.infer<typeof TwoFAUserVerifySchema>;

export type T_TwoFaUserType = T_TwoFAGeneratePrac | T_TwoFAGenerateUser;

export type T_TwoFaVerifyUserType = T_TwoFaVerifyPrac | T_TwoFaVerifyUser;

export function ValidateTwoFaGenerateUserType(
  type: T_TwoFaUserType
): T_TwoFaUserType | undefined {
  if (!type.type)
    throw new ZodError([
      {
        code: "custom",
        message: "User type is required",
        path: ["type"],
      },
    ]);
  if (type.type === "practitioner") return TwoFAPracGenerateSchema.parse(type);
  else if (type.type === "user") return TwoFAUserGenerateSchema.parse(type);
}

export function ValidateTwoFaVerifyUserType(
  type: T_TwoFaUserType
): T_TwoFaVerifyUserType | undefined {
  if (!type.type)
    throw new ZodError([
      {
        code: "custom",
        message: "User type is required",
        path: ["type"],
      },
    ]);
  if (type.type === "practitioner") return TwoFAPracVerifySchema.parse(type);
  else if (type.type === "user") return TwoFAUserVerifySchema.parse(type);
}
