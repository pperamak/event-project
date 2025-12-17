import { z } from "zod";

export const addMessageSchema = z.object({
  eventId: z
    .coerce.number().int().positive(),

  content: z
    .string()
    .trim()
    .min(1)
    .max(2000),
});

export type AddMessageInput = z.infer<typeof addMessageSchema>;