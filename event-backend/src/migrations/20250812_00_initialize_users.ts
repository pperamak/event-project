import { DataTypes } from "sequelize";
import { Migration } from "../types/migration.js";


export const up: Migration["up"] = async (queryInterface, Sequelize) =>{
  await queryInterface.createTable('users',{
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
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  });
};

export const down: Migration["down"] = async (queryInterface, _Sequelize) => {
  await queryInterface.dropTable('users');
};