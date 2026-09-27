import { decodeJwt, SignJWT, jwtVerify } from "jose";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { sessionRepository } from "../repositories/session.repository.js";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret(): Uint8Array {
  return new TextEncoder().encode(env.AUTH_SECRET);
}

export async function createSessionToken(userId: string): Promise<string> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  const expiration = decodeJwt(token).exp;
  if (!expiration) throw new Error("Session token has no expiration.");
  await sessionRepository.create(token, userId, new Date(expiration * 1000));
  return token;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<string | null> {
  if (!token) return null;
  let userId: string | undefined;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
    });
    userId = payload.sub;
  } catch {
    return null;
  }
  if (!userId) return null;
  return (await sessionRepository.findActive(token, userId)) ? userId : null;
}

export async function revokeSessionToken(
  token: string | undefined,
): Promise<void> {
  if (token) await sessionRepository.revoke(token);
}
