import { DataTypes } from "sequelize";
import type { Migration } from "./migration.js";

export const orderDeliveryMethod: Migration = {
  id: "004_order_delivery_method",
  async up(queryInterface, transaction) {
    await queryInterface.addColumn(
      "orders",
      "delivery_method",
      {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "ship",
      },
      { transaction },
    );
  },
  async down(queryInterface, transaction) {
    await queryInterface.removeColumn("orders", "delivery_method", {
      transaction,
    });
  },
};
