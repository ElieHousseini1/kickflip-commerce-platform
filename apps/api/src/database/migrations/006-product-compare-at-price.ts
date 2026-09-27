import { DataTypes } from "sequelize";
import type { Migration } from "./migration.js";

export const productCompareAtPrice: Migration = {
  id: "006_product_compare_at_price",
  async up(queryInterface, transaction) {
    await queryInterface.addColumn(
      "products",
      "compare_at_price_cents",
      { type: DataTypes.INTEGER, allowNull: true },
      { transaction },
    );
  },
  async down(queryInterface, transaction) {
    await queryInterface.removeColumn("products", "compare_at_price_cents", {
      transaction,
    });
  },
};
