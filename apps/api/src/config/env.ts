import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().max(65_535).default(4000),
    DATABASE_URL: z
      .string()
      .startsWith("sqlite:")
      .default("sqlite:./data/store.db"),
    AUTH_SECRET: z
      .string()
      .min(32)
      .default("development-secret-change-before-production"),
    CORS_ORIGINS: z.string().default("http://localhost:3000"),
    COOKIE_NAME: z.string().min(1).default("form_session"),
    COOKIE_DOMAIN: z.string().trim().min(1).optional(),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
  })
  .superRefine((value, context) => {
    if (
      value.NODE_ENV === "production" &&
      value.AUTH_SECRET === "development-secret-change-before-production"
    ) {
      context.addIssue({
        code: "custom",
        path: ["AUTH_SECRET"],
        message: "AUTH_SECRET must be explicitly configured in production.",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = {
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type Environment = typeof env;
