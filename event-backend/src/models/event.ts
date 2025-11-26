import {
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import { sequelize } from "../util/db.js";
import type { User } from "./index.js";
import type { EventAttributes } from "../types/eventAttributes.type.js";
import type { EventCreationAttributes } from "../types/eventCreationAttributes.type.js";

class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  declare id: number;
  declare name: string;
  declare time: Date;
  declare description: string;
  declare userId: number;
  declare image?: string;

  // ✅ Association (typed)
  declare user?: User;

  // ✅ Sequelize mixins
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare createUser: BelongsToCreateAssociationMixin<User>;

  toJSON() {
    const base = {
      id: this.id,
      name: this.name,
      time: this.time,
      description: this.description,
      userId: this.userId,
      image: this.image
    };

    if (this.user) {
      const safeUser =
        typeof this.user.toSafeJSON === "function"
          ? this.user.toSafeJSON()
          : {
              id: this.user.id,
              name: this.user.name,
              email: this.user.email,
            };
      return { ...base, user: safeUser };
    }

    return base;
  }
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true},
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      field: "user_id",
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "event",
  }
);

export default Event;
