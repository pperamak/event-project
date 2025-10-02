import { Optional } from "sequelize";
import { EventAttributes } from "./eventAttributes.type.js";

export type EventCreationAttributes = Optional<EventAttributes, "id">;