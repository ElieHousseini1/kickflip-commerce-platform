import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    sequence: { concurrent: false },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/server.ts", "src/database/migrations/**"],
    },
  },
});
