import { DataTypes } from "sequelize";
import type { Migration } from "./migration.js";

export const sessions: Migration = {
  id: "008_sessions",
  async up(queryInterface, transaction) {
    await queryInterface.createTable(
      "sessions",
      {
        token_hash: {
          type: DataTypes.STRING(64),
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
        },
        expires_at: { type: DataTypes.DATE, allowNull: false },
      },
      { transaction },
    );
  },
  async down(queryInterface, transaction) {
    await queryInterface.dropTable("sessions", { transaction });
  },
};
