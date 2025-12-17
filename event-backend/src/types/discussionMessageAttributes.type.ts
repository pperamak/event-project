import { z } from "zod";
import { discussionMessageSchema } from "../schemas/discussionMessage.schema.js";

export type DiscussionMessageAttributes = z.infer<typeof discussionMessageSchema>;