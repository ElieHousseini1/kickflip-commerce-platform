import {
  closeDatabase,
  configureDatabase,
  sequelize,
} from "../config/database.js";
import { logger } from "../config/logger.js";
import { catalog } from "./catalog.js";
import { runMigrations } from "./migrations/index.js";
import { initializeModels, Product, ProductVariant } from "./models/index.js";

export async function seedDatabase(): Promise<void> {
  initializeModels(sequelize);

  if ((await Product.count()) === 0) {
    await sequelize.transaction(async (transaction) => {
      for (const item of catalog) {
        await Product.create(
          {
            id: item.id,
            slug: item.slug,
            name: item.name,
            category: item.category,
            priceCents: Math.round(item.price * 100),
            stockQuantity: item.stockQuantity,
            description: item.description,
            image: item.image,
            variantName: item.variantName,
            badge: item.badge ?? null,
          },
          { transaction },
        );
        await ProductVariant.bulkCreate(
          item.variantOptions.map((name, index) => ({
            id: `${item.id}-variant-${index + 1}`,
            productId: item.id,
            name,
            color: item.colors[index] ?? "#000000",
            sortOrder: index,
          })),
          { transaction },
        );
      }
    });
  }
}

const executedDirectly = process.argv[1]?.endsWith("seed.ts") ?? false;
if (executedDirectly) {
  try {
    await configureDatabase();
    await runMigrations();
    await seedDatabase();
    logger.info("Database seeding completed");
  } catch (error) {
    logger.fatal({ error }, "Database seeding failed");
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}
