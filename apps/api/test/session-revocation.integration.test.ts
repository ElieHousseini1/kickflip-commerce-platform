import request from "supertest";
import { afterAll, beforeAll, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { closeDatabase } from "../src/config/database.js";
import { bootstrapDatabase } from "../src/database/bootstrap.js";

const app = createApp();

beforeAll(bootstrapDatabase);
afterAll(closeDatabase);

it("rejects a copied cookie after logout while another session remains valid", async () => {
  const email = "logout-revocation@example.com";
  const password = "correct-horse-battery-staple";
  const first = await request(app)
    .post("/api/auth/register")
    .set("Origin", "http://localhost:3000")
    .send({ name: "Logout Test", email, password })
    .expect(201);
  const firstCookie = first.headers["set-cookie"]?.[0]?.split(";")[0];
  if (!firstCookie)
    throw new Error("Registration did not set a session cookie.");

  const second = await request(app)
    .post("/api/auth/login")
    .set("Origin", "http://localhost:3000")
    .send({ email, password, rememberMe: false });
  expect(second.status, JSON.stringify(second.body)).toBe(200);
  const secondCookie = second.headers["set-cookie"]?.[0]?.split(";")[0];
  if (!secondCookie) throw new Error("Login did not set a session cookie.");
  expect(secondCookie).not.toBe(firstCookie);

  await request(app)
    .get("/api/auth/session")
    .set("Cookie", firstCookie)
    .expect(200);
  await request(app)
    .get("/api/auth/session")
    .set("Cookie", secondCookie)
    .expect(200);

  await request(app)
    .post("/api/auth/logout")
    .set("Origin", "http://localhost:3000")
    .set("Cookie", firstCookie)
    .expect(200);

  await request(app)
    .get("/api/auth/session")
    .set("Cookie", firstCookie)
    .expect(401);
  await request(app).get("/api/cart").set("Cookie", firstCookie).expect(401);
  await request(app)
    .get("/api/auth/session")
    .set("Cookie", secondCookie)
    .expect(200);

  await request(app)
    .post("/api/auth/logout")
    .set("Origin", "http://localhost:3000")
    .set("Cookie", firstCookie)
    .expect(200);
  await request(app)
    .post("/api/auth/logout")
    .set("Origin", "http://localhost:3000")
    .set("Cookie", secondCookie)
    .expect(200);
  await request(app)
    .get("/api/auth/session")
    .set("Cookie", secondCookie)
    .expect(401);
});
