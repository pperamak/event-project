import { QueryInterface, Sequelize } from "sequelize";

export type Migration = {
  up: (queryInterface: QueryInterface, sequelize: typeof Sequelize) => Promise<void>;
  down: (queryInterface: QueryInterface, sequelize: typeof Sequelize) => Promise<void>;
};