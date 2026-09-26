import type { ErrorRequestHandler, RequestHandler } from "express";
import {
  DatabaseError,
  ForeignKeyConstraintError,
  ValidationError,
} from "sequelize";
import { logger } from "../config/logger.js";
import { AppError } from "../errors/app-error.js";

export const notFoundHandler: RequestHandler = (request, response) => {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `No route matches ${request.method} ${request.path}.`,
    },
  });
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });
    return;
  }

  if (
    error instanceof ValidationError ||
    error instanceof ForeignKeyConstraintError
  ) {
    response.status(400).json({
      error: { code: "DATABASE_VALIDATION", message: "Invalid resource data." },
    });
    return;
  }

  logger.error(
    {
      error,
      method: request.method,
      path: request.path,
      requestId: response.getHeader("x-request-id"),
    },
    error instanceof DatabaseError
      ? "Unexpected database error"
      : "Unexpected request error",
  );
  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
    },
  });
};
