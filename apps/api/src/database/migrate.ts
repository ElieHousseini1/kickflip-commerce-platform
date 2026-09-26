import { closeDatabase, configureDatabase } from "../config/database.js";
import { logger } from "../config/logger.js";
import { runMigrations } from "./migrations/index.js";

try {
  await configureDatabase();
  await runMigrations();
  logger.info("Database migrations completed");
} catch (error) {
  logger.fatal({ error }, "Database migration failed");
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
