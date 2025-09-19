import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db.js";
import { UserAttributes } from "../types/userAttributes.type.js";
import { UserCreationAttributes } from "../types/userCreationAttributes.type.js";

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;


public toSafeJSON() {
    const { passwordHash: _passwordHash, ...safeUser } = this.toJSON();
    return safeUser;
  }
};

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'
  }
},{
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
  },
);

export default User;