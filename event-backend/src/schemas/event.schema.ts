import { z } from "zod";

export const eventSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  time: z.date(),
  description: z.string(),
  userId: z.number().int().positive()
});
  