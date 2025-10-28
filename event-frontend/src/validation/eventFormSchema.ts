import { z } from "zod";

// If you have zod >= 3.17 use z.coerce.date(); otherwise use preprocess (shown below)
export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  
  time:
  z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date().min(new Date(), "Please pick a future date")
),

  description: z.string().min(1, "Description is required"),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;