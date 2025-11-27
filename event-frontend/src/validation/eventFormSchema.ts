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

  image: z
  .instanceof(FileList)
  .refine(
    (files) => !files || files.length <= 1,
    "You can only upload one file"
  )
  .optional()
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;