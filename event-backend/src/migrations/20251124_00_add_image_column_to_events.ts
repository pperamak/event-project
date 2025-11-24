import { DataTypes } from "sequelize";
import { Migration } from "../types/migration.js";

export const up: Migration["up"] = async (queryInterface, _Sequelize) =>{
  await queryInterface.addColumn('events', 'image',{
    type: DataTypes.STRING,
    allowNull: true
  });
};

export const down: Migration["down"] = async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn('events', 'image');
  };