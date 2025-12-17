import { z } from "zod";

export const discussionMessageSchema = z.object({
  id: z.number().int().positive().optional(),
  content: z.string().min(1),
  userId: z.number().int().positive(),
  eventId: z.number().int().positive(),
});