import { defineConfig } from "vitest/config";

// Separate from vite.config.js so tests run without the app plugins.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
  },
});
