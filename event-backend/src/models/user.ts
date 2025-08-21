import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";
import { UserAttributes } from "../types/userAttributes.type";
import { UserCreationAttributes } from "../types/userCreationAttributes.type";

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public passwordHash!: string;


public toSafeJSON() {
    const { passwordHash, ...safeUser } = this.toJSON();
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
    allowNull: false
  }
},{
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
  },
);

export default User;