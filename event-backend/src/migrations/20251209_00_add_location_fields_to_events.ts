import { DataTypes } from "sequelize";
import type { Migration } from "../types/migration.js";

export const up: Migration["up"] = async (queryInterface, _Sequelize) => {
  await queryInterface.addColumn("events", "latitude", {
    type: DataTypes.FLOAT,
    allowNull: true,
  });

  await queryInterface.addColumn("events", "longitude", {
    type: DataTypes.FLOAT,
    allowNull: true,
  });

  await queryInterface.addColumn("events", "address", {
    type: DataTypes.STRING,
    allowNull: true,
  });
};

export const down: Migration["down"] = async (queryInterface, _Sequelize) => {
  await queryInterface.removeColumn("events", "address");
  await queryInterface.removeColumn("events", "longitude");
  await queryInterface.removeColumn("events", "latitude");
};