import { z } from "zod";
import { eventSchema } from "../schemas/event.schema.js";

export type EventAttributes = z.infer<typeof eventSchema>;