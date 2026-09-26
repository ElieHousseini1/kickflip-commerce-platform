import type { Request } from "express";
import { AppError } from "../errors/app-error.js";

export function authenticationRequiredError(): AppError {
  return new AppError("Authentication required.", {
    status: 401,
    code: "UNAUTHORIZED",
  });
}

export function authenticatedUserId(request: Request): string {
  if (!request.user) {
    throw authenticationRequiredError();
  }
  return request.user.id;
}
