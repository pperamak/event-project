import { QueryInterface } from "sequelize";

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.addConstraint('users', {
    fields: ['email'],
    type: 'unique',
    name: 'users_email_unique'
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.removeConstraint('users', 'users_email_unique');
};