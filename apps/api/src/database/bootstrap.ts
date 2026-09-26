import { configureDatabase, sequelize } from "../config/database.js";
import { runMigrations } from "./migrations/index.js";
import { initializeModels } from "./models/index.js";
import { seedDatabase } from "./seed.js";

let bootstrapped = false;

export async function bootstrapDatabase(): Promise<void> {
  if (bootstrapped) return;
  await configureDatabase();
  await runMigrations();
  initializeModels(sequelize);
  await seedDatabase();
  bootstrapped = true;
}
