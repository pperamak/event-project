import { z } from "zod";

// If you have zod >= 3.17 use z.coerce.date(); otherwise use preprocess (shown below)
export const createEventInputSchema = z.object({
  name: z.string().min(1),
  // coerce accepts e.g. "2025-10-03T12:00:00Z" and turns it into a Date
  time: z.coerce.date(),
  description: z.string().min(0),
  image: z.string().optional()
});

// If you don't have z.coerce.date():
// time: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date())

