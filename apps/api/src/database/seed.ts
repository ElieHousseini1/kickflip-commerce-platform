import {
  closeDatabase,
  configureDatabase,
  sequelize,
} from "../config/database.js";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../config/logger.js";
import { catalog } from "./catalog.js";
import { runMigrations } from "./migrations/index.js";
import {
  Asset,
  initializeModels,
  Product,
  ProductVariant,
} from "./models/index.js";

const assetsDirectory = fileURLToPath(
  new URL("../../assets/", import.meta.url),
);
const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

async function listAssetFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? listAssetFiles(entryPath)
        : Promise.resolve([entryPath]);
    }),
  );
  return nested.flat();
}

export async function seedDatabase(): Promise<void> {
  initializeModels(sequelize);
  const assetFiles = await listAssetFiles(assetsDirectory);

  await sequelize.transaction(async (transaction) => {
    for (const file of assetFiles) {
      const key = path
        .relative(assetsDirectory, file)
        .split(path.sep)
        .join("/");
      const contentType = contentTypes[path.extname(file).toLowerCase()];
      if (!contentType) throw new Error(`Unsupported asset type: ${key}`);

      const data = await readFile(file);
      const etag = `"${createHash("sha256").update(data).digest("hex")}"`;
      await Asset.upsert({ key, contentType, data, etag }, { transaction });
    }

    for (const item of catalog) {
      const image = item.image.replace(/^\//, "");
      const [product, created] = await Product.findOrCreate({
        where: { id: item.id },
        defaults: {
          id: item.id,
          slug: item.slug,
          name: item.name,
          category: item.category,
          priceCents: Math.round(item.price * 100),
          compareAtPriceCents:
            item.compareAtPrice !== undefined
              ? Math.round(item.compareAtPrice * 100)
              : null,
          stockQuantity: item.stockQuantity,
          description: item.description,
          image,
          variantName: item.variantName,
          badge: item.badge ?? null,
        },
        transaction,
      });

      if (!created) {
        await product.update(
          {
            slug: item.slug,
            name: item.name,
            category: item.category,
            priceCents: Math.round(item.price * 100),
            compareAtPriceCents:
              item.compareAtPrice !== undefined
                ? Math.round(item.compareAtPrice * 100)
                : null,
            description: item.description,
            image,
            variantName: item.variantName,
            badge: item.badge ?? null,
          },
          { transaction },
        );
      }

      for (const [index, name] of item.variantOptions.entries()) {
        const id = `${item.id}-variant-${index + 1}`;
        const [variant, variantCreated] = await ProductVariant.findOrCreate({
          where: { id },
          defaults: {
            id,
            productId: item.id,
            name,
            color: item.colors[index] ?? "#000000",
            sortOrder: index,
          },
          transaction,
        });

        if (!variantCreated) {
          await variant.update(
            {
              name,
              color: item.colors[index] ?? "#000000",
              sortOrder: index,
            },
            { transaction },
          );
        }
      }
    }
  });
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
