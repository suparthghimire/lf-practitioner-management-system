import { z } from "zod";

export const TwoFaSchema = z.object({
  secret: z.string(),
  qrImage: z.string(),
  verified: z.boolean().default(false),
});

export type TwoFa = z.infer<typeof TwoFaSchema>;
