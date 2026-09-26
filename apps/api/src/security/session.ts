import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret(): Uint8Array {
  return new TextEncoder().encode(env.AUTH_SECRET);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
