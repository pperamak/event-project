import {
  Model,
  DataTypes,
} from "sequelize";
import { sequelize } from "../util/db.js";
import { ReactionType } from "../types/messageReaction.type.js";

interface MessageReactionAttributes {
  id: number;
  type: ReactionType;
  messageId: number;
  userId: number;
}

type MessageReactionCreationAttributes =
  Omit<MessageReactionAttributes, "id">;

class MessageReaction
  extends Model<
  MessageReactionAttributes,
  MessageReactionCreationAttributes
> implements MessageReactionAttributes {
  declare id: number;
  declare type: ReactionType;
  declare messageId: number;
  declare userId: number;
}

MessageReaction.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: {
      type: DataTypes.ENUM(...Object.values(ReactionType)),
      allowNull: false,
    },
    messageId:
    {
      type:DataTypes.INTEGER,
      allowNull: false,
      references: { model: "discussionMessage", key: "id"},
      field: "message_id"
    },
    userId:
    {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      field: "user_id",
    },
    
  },
  { sequelize,
    underscored: true,
    timestamps: true,
    modelName: "messageReaction",
    indexes: [
    {
      unique: true,
      fields: ["message_id", "user_id"],
      name: "unique_user_message_reaction",
    },
  ],
   }
);

export default MessageReaction;