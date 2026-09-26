import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "../contracts/auth.contract.js";
import { env } from "../config/env.js";
import { authService } from "../services/auth.service.js";
import {
  createSessionToken,
  SESSION_MAX_AGE_SECONDS,
} from "../security/session.js";
import { authenticationRequiredError } from "../security/authenticated-user.js";
import { serializeUser } from "../serializers/user.serializer.js";

function setSessionCookie(
  response: Response,
  token: string,
  persistent: boolean,
): void {
  response.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    ...(persistent ? { maxAge: SESSION_MAX_AGE_SECONDS * 1000 } : {}),
  });
}

export const authController = {
  login: async (
    request: Request<object, object, LoginInput>,
    response: Response,
  ) => {
    const user = await authService.login(request.body);
    setSessionCookie(
      response,
      await createSessionToken(user.id),
      request.body.rememberMe,
    );
    response.json({ user });
  },

  register: async (
    request: Request<object, object, RegisterInput>,
    response: Response,
  ) => {
    const user = await authService.register(request.body);
    setSessionCookie(response, await createSessionToken(user.id), true);
    response.status(201).json({ user });
  },

  session: (request: Request, response: Response) => {
    if (!request.user) {
      throw authenticationRequiredError();
    }
    response.json({ user: serializeUser(request.user) });
  },

  logout: (_request: Request, response: Response) => {
    response.clearCookie(env.COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    });
    response.json({ success: true });
  },
};
