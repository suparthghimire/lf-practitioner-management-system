import { z } from "zod";

export const Attendance = z.object({
  id: z.number(),
  date: z.date(),
  checkInTime: z.date().nullable(),
  checkOutTime: z.date().nullable(),
  duration: z.number().nullable(),
  wasOvertime: z.boolean().nullable(),
  wasLate: z.boolean().nullable(),
  minHrAchieved: z.boolean().nullable(),
  practitionerId: z.string(),
});

export type T_Attendance = z.infer<typeof Attendance>;
