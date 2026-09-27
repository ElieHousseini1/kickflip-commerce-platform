import { DataTypes, Sequelize } from "sequelize";
import type { Migration } from "./migration.js";

export const assets: Migration = {
  id: "007_assets",
  async up(queryInterface, transaction) {
    await queryInterface.createTable(
      "assets",
      {
        key: {
          type: DataTypes.STRING(255),
          primaryKey: true,
          allowNull: false,
        },
        content_type: { type: DataTypes.STRING(100), allowNull: false },
        data: { type: DataTypes.BLOB("long"), allowNull: false },
        etag: { type: DataTypes.STRING(66), allowNull: false },
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
      },
      { transaction },
    );
  },
  async down(queryInterface, transaction) {
    await queryInterface.dropTable("assets", { transaction });
  },
};
