import { z } from "zod";
import { eventSchema } from "../schemas/event.model.schema.js";

export type EventAttributes = z.infer<typeof eventSchema>;