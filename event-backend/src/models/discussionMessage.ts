import {
  Model,
  DataTypes,
} from "sequelize";
import { sequelize } from "../util/db.js";
import type { DiscussionMessageAttributes } from "../types/discussionMessageAttributes.type.js";
import type { DiscussionMessageCreationAttributes } from "../types/discussionMessageCreationAttributes.type.js";

class DiscussionMessage
    extends Model<DiscussionMessageAttributes, DiscussionMessageCreationAttributes>
    implements DiscussionMessageAttributes
    {
      declare id: number;
      declare content: string;
      declare userId: number;
      declare eventId: number;
    }

DiscussionMessage.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId:
    {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      field: "user_id",
    },
    eventId:
    {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "events", key: "id"},
      field: "event_id"
    }
  },
  { sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'discussionMessage',
    indexes: [
      { fields: ["event_id"] },
      { fields: ["user_id"] },
      { fields: ["event_id", "created_at"] },
    ],
   }
);

export default DiscussionMessage;