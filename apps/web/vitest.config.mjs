import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./test/server-only.js", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{js,jsx}"],
    setupFiles: ["./test/setup.js"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
