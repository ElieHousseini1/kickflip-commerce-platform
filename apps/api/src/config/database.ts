import { mkdirSync } from "node:fs";
import path from "node:path";
import { Sequelize } from "sequelize";
import { env } from "./env.js";
import { logger } from "./logger.js";

function ensureSqliteDirectory(url: string): void {
  if (!url.startsWith("sqlite:") || url === "sqlite::memory:") return;
  const storage = url.slice("sqlite:".length);
  const absoluteStorage = path.resolve(storage);
  mkdirSync(path.dirname(absoluteStorage), { recursive: true });
}

ensureSqliteDirectory(env.DATABASE_URL);

const storage = env.DATABASE_URL.slice("sqlite:".length);

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging:
    env.NODE_ENV === "development"
      ? (message) => logger.debug({ sql: message }, "Database query")
      : false,
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
  retry: { max: 3 },
});

export async function configureDatabase(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.query("PRAGMA foreign_keys = ON");
  if (env.DATABASE_URL !== "sqlite::memory:") {
    await sequelize.query("PRAGMA journal_mode = WAL");
  }
}

export async function closeDatabase(): Promise<void> {
  await sequelize.close();
}
