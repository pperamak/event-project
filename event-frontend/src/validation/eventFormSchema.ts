import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),

  time: z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date().min(new Date(), "Please pick a future date")
),

  description: z.string().min(1, "Description is required"),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;