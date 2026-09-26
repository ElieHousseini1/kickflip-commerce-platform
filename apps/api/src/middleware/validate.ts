import type { NextFunction, Request, Response } from "express";
import { flattenError, type ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      response.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: result.error.issues[0]?.message ?? "Invalid request body.",
          details: flattenError(result.error).fieldErrors,
        },
      });
      return;
    }
    request.body = result.data;
    next();
  };
}
