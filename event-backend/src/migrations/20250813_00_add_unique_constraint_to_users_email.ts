//import { QueryInterface } from "sequelize";
import { Migration } from "../types/migration.js";

export const up: Migration["up"] = async (queryInterface, _Sequelize) => {
  await queryInterface.addConstraint('users', {
    fields: ['email'],
    type: 'unique',
    name: 'users_email_unique'
  });
};

export const down: Migration["down"] = async (queryInterface, _Sequelize) => {
  await queryInterface.removeConstraint('users', 'users_email_unique');
};