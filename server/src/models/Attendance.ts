import { z } from "zod";
import { prismaClient } from "..";
import moment from "moment";
import { DayName } from "@prisma/client";
export const CheckinSchema = z
  .object({
    checkInTime: z.date(),
    practitionerId: z.number(),
  })
  .superRefine(async (v, ctx) => {
    // check if practitioner exists
    const practitioner = await prismaClient.practitioner.findUnique({
      where: {
        id: v.practitionerId,
      },
      include: {
        WorkingDays: true,
      },
    });

    if (practitioner) {
      //   see if practitioner is working today
      const today = moment(new Date()).format("dddd") as DayName;
      const isWorkingToday = practitioner.WorkingDays.some(
        (day) => day.day === today
      );
      if (!isWorkingToday)
        ctx.addIssue({
          code: "custom",
          message: "Practitioner Is Not Working Today",
          path: ["practitionerId"],
        });
    } else
      ctx.addIssue({
        code: "custom",
        message: "Practitioner not found",
        path: ["practitionerId"],
      });
    return;
  });

export const CheckoutSchema = z
  .object({
    checkOutTime: z.date(),
    attendanceId: z.number(),
  })
  .superRefine(async (v, ctx) => {
    // check if practitioner exists
    const attendance = await prismaClient.attendance.findUnique({
      where: {
        id: v.attendanceId,
      },
    });

    if (!attendance)
      ctx.addIssue({
        code: "custom",
        message: "Attendance not found",
        path: ["attendanceId"],
      });
  });

export type T_Checkin = z.infer<typeof CheckinSchema>;
export type T_Checkout = z.infer<typeof CheckoutSchema>;

export async function ValidateCheckin(data: T_Checkin) {
  await CheckinSchema.parseAsync(data);
}
export async function ValidateCheckout(data: T_Checkout) {
  await CheckoutSchema.parseAsync(data);
}
