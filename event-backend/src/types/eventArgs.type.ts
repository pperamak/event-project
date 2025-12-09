import { z } from "zod";
import { createEventInputSchema } from "../schemas/event.input.schema.js";

export type EventArgs = {
  input: z.infer<typeof createEventInputSchema>
};