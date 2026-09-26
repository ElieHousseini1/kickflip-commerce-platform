import type { Migration } from "./migration.js";

export const repairPocketSkateToolTimestamp: Migration = {
  id: "003_repair_pocket_skate_tool_timestamp",
  async up(queryInterface, transaction) {
    await queryInterface.bulkUpdate(
      "products",
      { updated_at: new Date().toISOString() },
      { id: "vase-002" },
      { transaction },
    );
  },
  async down(_queryInterface, _transaction) {
    // The previous timestamp may be unreadable; retain the repaired value.
  },
};
