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
  let source = origin;
  if (!source) {
    const referer = request.get("referer");
    if (referer) {
      try {
        source = new URL(referer).origin;
      } catch {
        source = undefined;
      }
    }
  }
  let requestOrigin: string | undefined;
  try {
    requestOrigin = new URL(`${request.protocol}://${request.get("host")}`)
      .origin;
  } catch {
    requestOrigin = undefined;
  }
  if (
    source &&
    (source === requestOrigin || env.CORS_ORIGINS.includes(source))
  ) {
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
