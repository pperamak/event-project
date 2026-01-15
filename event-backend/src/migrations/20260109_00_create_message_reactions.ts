import { DataTypes } from "sequelize";
import { Migration } from "../types/migration.js";

export const up: Migration["up"] = async (queryInterface, Sequelize) =>{
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_message_reactions_type" AS ENUM ('UP', 'DOWN');
  `);

  await queryInterface.createTable("message_reactions", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    type: {
      type: "enum_message_reactions_type",
      allowNull: false,
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "discussion_messages", key: "id" },
      onDelete: "CASCADE"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    created_at: {
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
  await queryInterface.addIndex(
    "message_reactions",
    ["message_id", "user_id"],
    {
      unique: true,
      name: "unique_user_message_reaction",
    }
  );
};

export const down: Migration["down"] = async (queryInterface, _Sequelize) => {
  await queryInterface.dropTable("message_reactions");
  await queryInterface.sequelize.query(`
    DROP TYPE "enum_message_reactions_type";
  `);
};