import { z } from "zod";

export const eventSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  time: z.date(),
  description: z.string(),
  userId: z.number().int().positive(),
  image: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional()
});
  