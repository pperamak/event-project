import { DataTypes } from "sequelize";
import { Migration } from "../types/migration.js";

export const up: Migration["up"] = async (queryInterface, Sequelize) =>{
  await queryInterface.createTable("discussion_messages", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
        onUpdate: "CASCADE",
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

     await queryInterface.addIndex("discussion_messages", ["event_id"], {
      name: "discussion_messages_event_id_idx",
    });

    await queryInterface.addIndex("discussion_messages", ["user_id"], {
      name: "discussion_messages_user_id_idx",
    });

    await queryInterface.addIndex(
      "discussion_messages",
      ["event_id", "created_at"],
      {
        name: "discussion_messages_event_created_at_idx",
      }
    );
  };

  export const down: Migration["down"] = async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable("discussion_messages");
  };

