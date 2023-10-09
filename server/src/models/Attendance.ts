import { z } from "zod";
import { prismaClient } from "..";
import moment from "moment";
import { DayName } from "@prisma/client";

export const CheckinoutSchema = z
  .object({
    time: z.date(),
    practitionerId: z.number(),
  })
  .superRefine(async (v, ctx) => {
    // check if practitioner exists
    const practitioner = await prismaClient.practitioner.findUnique({
      where: {
        id: v.practitionerId,
      },
    });

    if (!practitioner)
      ctx.addIssue({
        code: "custom",
        message: "Practitioner not found",
        path: ["practitionerId"],
      });
  });

export type T_CheckInOut = z.infer<typeof CheckinoutSchema>;

export async function ValidateCheckInOut(data: T_CheckInOut) {
  await CheckinoutSchema.parseAsync(data);
}
