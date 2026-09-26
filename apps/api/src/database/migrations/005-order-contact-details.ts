import { DataTypes } from "sequelize";
import type { Migration } from "./migration.js";

export const orderContactDetails: Migration = {
  id: "005_order_contact_details",
  async up(queryInterface, transaction) {
    await queryInterface.addColumn(
      "orders",
      "phone",
      { type: DataTypes.STRING(20), allowNull: true },
      { transaction },
    );
    await queryInterface.addColumn(
      "orders",
      "apartment",
      { type: DataTypes.STRING(200), allowNull: true },
      { transaction },
    );
  },
  async down(queryInterface, transaction) {
    await queryInterface.removeColumn("orders", "apartment", { transaction });
    await queryInterface.removeColumn("orders", "phone", { transaction });
  },
};
