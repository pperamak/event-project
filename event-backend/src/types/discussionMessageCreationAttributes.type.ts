import { Optional } from "sequelize";
import { DiscussionMessageAttributes } from "./discussionMessageAttributes.type.js";

export type DiscussionMessageCreationAttributes = Optional<DiscussionMessageAttributes, "id">;