import request from "supertest";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { closeDatabase } from "../src/config/database.js";
import { bootstrapDatabase } from "../src/database/bootstrap.js";
import { User } from "../src/database/models/user.model.js";

const app = createApp();
app.set("trust proxy", 1);

beforeAll(bootstrapDatabase);
afterAll(closeDatabase);

it("creates a session on signup and preserves generic login failures", async () => {
  const account = {
    name: "Security Test",
    email: "security-test@example.com",
    password: "correct-horse-battery-staple",
  };
  const first = await request(app)
    .post("/api/auth/register")
    .set("Origin", "http://localhost:3000")
    .send(account)
    .expect(201);
  const second = await request(app)
    .post("/api/auth/register")
    .set("Origin", "http://localhost:3000")
    .send(account)
    .expect(409);
  expect(first.body.user.email).toBe(account.email);
  expect(first.headers["set-cookie"]).toBeDefined();
  expect(second.body.error.code).toBe("EMAIL_EXISTS");
  expect(second.headers["set-cookie"]).toBeUndefined();
  expect(await User.count({ where: { email: account.email } })).toBe(1);

  const unknown = await request(app)
    .post("/api/auth/login")
    .set("Origin", "http://localhost:3000")
    .send({
      email: "missing-security-test@example.com",
      password: account.password,
    })
    .expect(401);
  const wrong = await request(app)
    .post("/api/auth/login")
    .set("Origin", "http://localhost:3000")
    .send({ email: account.email, password: "incorrect-password-123" })
    .expect(401);
  expect(wrong.body).toEqual(unknown.body);

  await request(app)
    .post("/api/auth/login")
    .set("Origin", "http://localhost:3000")
    .send({ email: account.email, password: account.password })
    .expect(200);
});

it("requires a trusted Origin or Referer for mutations", async () => {
  const body = {
    name: "Origin Test",
    email: "origin-test@example.com",
    password: "correct-horse-battery-staple",
  };
  await request(app).post("/api/auth/register").send(body).expect(403);
  await request(app)
    .post("/api/auth/register")
    .set("Referer", "https://attacker.example/path")
    .send(body)
    .expect(403);
  await request(app)
    .post("/api/auth/register")
    .set("Referer", "http://localhost:3000/signup")
    .send(body)
    .expect(201);
  await request(app)
    .post("/api/auth/register")
    .set("Host", "api.example")
    .set("Origin", "http://api.example")
    .send({ ...body, email: "same-origin@example.com" })
    .expect(201);
});

it("rejects bcrypt-truncated passwords for registration and login", async () => {
  const password = `${"a".repeat(71)}é`;
  const email = "legacy-long-password@example.com";
  await request(app)
    .post("/api/auth/register")
    .set("Origin", "http://localhost:3000")
    .send({ name: "New Customer", email, password })
    .expect(400);

  await User.create({
    id: randomUUID(),
    name: "Legacy Customer",
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });
  await request(app)
    .post("/api/auth/login")
    .set("Origin", "http://localhost:3000")
    .send({ email, password })
    .expect(400);
});

it("limits attempts against one account across source addresses", async () => {
  const credentials = {
    email: "distributed-guess@example.com",
    password: "incorrect-password-123",
  };
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    await request(app)
      .post("/api/auth/login")
      .set("Origin", "http://localhost:3000")
      .set("X-Forwarded-For", `203.0.113.${attempt}`)
      .send(credentials)
      .expect(401);
  }
  const limited = await request(app)
    .post("/api/auth/login")
    .set("Origin", "http://localhost:3000")
    .set("X-Forwarded-For", "203.0.113.11")
    .send(credentials)
    .expect(429);
  expect(limited.body.error.code).toBe("RATE_LIMITED");
});
