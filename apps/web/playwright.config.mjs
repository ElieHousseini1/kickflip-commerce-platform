import { defineConfig, devices } from "@playwright/test";
import { tmpdir } from "node:os";
import path from "node:path";

const testDatabasePath = path.join(tmpdir(), `form-e2e-${process.pid}.db`);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `NODE_ENV=test PORT=4100 AUTH_SECRET=e2e-secret-that-is-longer-than-thirty-two-characters DATABASE_URL=sqlite:${testDatabasePath} CORS_ORIGINS=http://127.0.0.1:3100 npm run build && NODE_ENV=test PORT=4100 AUTH_SECRET=e2e-secret-that-is-longer-than-thirty-two-characters DATABASE_URL=sqlite:${testDatabasePath} CORS_ORIGINS=http://127.0.0.1:3100 npm start`,
      cwd: "../api",
      url: "http://127.0.0.1:4100/health",
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        "NEXT_PUBLIC_API_URL=http://127.0.0.1:4100/api BACKEND_API_URL=http://127.0.0.1:4100/api npm run start -- --hostname 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100/login",
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
