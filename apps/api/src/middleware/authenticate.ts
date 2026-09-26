import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";
import { authenticationRequiredError } from "../security/authenticated-user.js";
import { verifySessionToken } from "../security/session.js";

async function attachAuthenticatedUser(request: Request): Promise<void> {
  const userId = await verifySessionToken(
    request.cookies[env.COOKIE_NAME] as string | undefined,
  );
  if (!userId) return;

  const user = await userRepository.findById(userId);
  if (user) request.user = user;
}

export async function optionalAuthentication(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  await attachAuthenticatedUser(request);
  next();
}

export async function requireAuthentication(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  await attachAuthenticatedUser(request);
  if (!request.user) {
    next(authenticationRequiredError());
    return;
  }
  next();
}
