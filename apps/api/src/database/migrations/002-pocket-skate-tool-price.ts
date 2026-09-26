import type { Migration } from "./migration.js";

export const pocketSkateToolPrice: Migration = {
  id: "002_pocket_skate_tool_price",
  async up(queryInterface, transaction) {
    await queryInterface.bulkUpdate(
      "products",
      { price_cents: 4_500 },
      { id: "vase-002" },
      { transaction },
    );
  },
  async down(queryInterface, transaction) {
    await queryInterface.bulkUpdate(
      "products",
      { price_cents: 12_500 },
      { id: "vase-002" },
      { transaction },
    );
  },
};
