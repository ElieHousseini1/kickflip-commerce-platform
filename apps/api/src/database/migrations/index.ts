import { DataTypes, QueryTypes, type QueryInterface } from "sequelize";
import { sequelize } from "../../config/database.js";
import { initialSchema } from "./001-initial-schema.js";
import { pocketSkateToolPrice } from "./002-pocket-skate-tool-price.js";
import { repairPocketSkateToolTimestamp } from "./003-repair-pocket-skate-tool-timestamp.js";
import { orderDeliveryMethod } from "./004-order-delivery-method.js";
import { orderContactDetails } from "./005-order-contact-details.js";
import { productCompareAtPrice } from "./006-product-compare-at-price.js";
import type { Migration } from "./migration.js";

const migrations: Migration[] = [
  initialSchema,
  pocketSkateToolPrice,
  repairPocketSkateToolTimestamp,
  orderDeliveryMethod,
  orderContactDetails,
  productCompareAtPrice,
];

async function ensureMigrationTable(
  queryInterface: QueryInterface,
): Promise<void> {
  const tables = await queryInterface.showAllTables();
  if (tables.includes("schema_migrations")) return;

  await queryInterface.createTable("schema_migrations", {
    id: { type: DataTypes.STRING(100), primaryKey: true, allowNull: false },
    applied_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function runMigrations(): Promise<void> {
  const queryInterface = sequelize.getQueryInterface();
  await ensureMigrationTable(queryInterface);

  const appliedRows = await sequelize.query<{ id: string }>(
    "SELECT id FROM schema_migrations",
    { type: QueryTypes.SELECT },
  );
  const applied = new Set(appliedRows.map(({ id }) => id));

  for (const migration of migrations) {
    if (applied.has(migration.id)) continue;
    await sequelize.transaction(async (transaction) => {
      const transactionalInterface = sequelize.getQueryInterface();
      await migration.up(transactionalInterface, transaction);
      await transactionalInterface.bulkInsert(
        "schema_migrations",
        [{ id: migration.id, applied_at: new Date() }],
        { transaction },
      );
    });
  }
}
