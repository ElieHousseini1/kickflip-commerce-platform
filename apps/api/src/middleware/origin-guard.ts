import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export function originGuard(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    next();
    return;
  }

  const origin = request.get("origin");
  if (!origin || env.CORS_ORIGINS.includes(origin)) {
    next();
    return;
  }

  response.status(403).json({
    error: {
      code: "INVALID_ORIGIN",
      message: "Cross-origin request rejected.",
    },
  });
}
