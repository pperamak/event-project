import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db.js";
import { EventAttributes } from "../types/eventAttributes.type.js";
import { EventCreationAttributes } from "../types/eventCreationAttributes.type.js";

class Event extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes {
    declare id: number;
    declare name: string;
    declare time: Date;
    declare description: string;
    declare userId: number;
  }

Event.init({
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    },
},{
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'event'
});

export default Event;
