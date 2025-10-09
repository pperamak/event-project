import { z } from "zod";

// If you have zod >= 3.17 use z.coerce.date(); otherwise use preprocess (shown below)
export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // coerce accepts e.g. "2025-10-03T12:00:00Z" and turns it into a Date
  time: z.coerce.date().refine(
    (val) => val >= new Date(),
    { message: "Please pick a future date" }
  ),
  description: z.string().min(1, "Description is required"),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;