import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import hpp from "hpp";
import { randomUUID } from "node:crypto";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { sequelize } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { openApiDocument } from "./docs/openapi.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { originGuard } from "./middleware/origin-guard.js";
import { apiRateLimit } from "./middleware/rate-limits.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  if (env.NODE_ENV === "production") app.set("trust proxy", 1);

  app.use(
    pinoHttp({
      logger,
      genReqId(request, response) {
        const existing = request.headers["x-request-id"];
        const id = typeof existing === "string" ? existing : randomUUID();
        response.setHeader("x-request-id", id);
        return id;
      },
    }),
  );
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (!origin || env.CORS_ORIGINS.includes(origin)) callback(null, true);
        else callback(null, false);
      },
    }),
  );
  app.use(express.json({ limit: "32kb", strict: true }));
  app.use(cookieParser());
  app.use(hpp());
  app.use(originGuard);

  app.get("/health", async (_request, response) => {
    await sequelize.authenticate();
    response.json({ status: "ok", database: "connected" });
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get("/openapi.json", (_request, response) => {
    response.json(openApiDocument);
  });

  app.use("/api", apiRateLimit, apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
