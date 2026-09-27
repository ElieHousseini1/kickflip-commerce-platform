import { rateLimit } from "express-rate-limit";
import { createHash } from "node:crypto";

const commonOptions = {
  standardHeaders: "draft-8" as const,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    },
  },
};

export const apiRateLimit = rateLimit({
  ...commonOptions,
  windowMs: 60_000,
  limit: 180,
});

export const loginRateLimit = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
});

export const accountLoginRateLimit = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator(request) {
    const email = (request.body as { email: string }).email;
    return createHash("sha256").update(email).digest("hex");
  },
});

export const registrationRateLimit = rateLimit({
  ...commonOptions,
  windowMs: 60 * 60_000,
  limit: 5,
});
