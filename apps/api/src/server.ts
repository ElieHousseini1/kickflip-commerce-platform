import { createServer } from "node:http";
import { createApp } from "./app.js";
import { closeDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { bootstrapDatabase } from "./database/bootstrap.js";

try {
  await bootstrapDatabase();
  const server = createServer(createApp());
  server.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, environment: env.NODE_ENV },
      "Kickflip Supply API listening",
    );
  });

  const shutdown = (signal: string): void => {
    logger.info({ signal }, "Graceful shutdown started");
    server.close(() => {
      void closeDatabase().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
} catch (error) {
  logger.fatal({ error }, "Unable to start API");
  await closeDatabase().catch(() => undefined);
  process.exit(1);
}
