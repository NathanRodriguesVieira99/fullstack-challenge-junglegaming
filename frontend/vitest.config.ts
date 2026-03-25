import path, { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{spec,test}.{ts,tsx}"],
    reporters: ["verbose"],
    environment: "jsdom",
    root: "./",
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    testTimeout: 10000,
    setupFiles: [resolve(__dirname, "vitest.setup.ts")],

    coverage: {
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov", "cobertura"],
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],

      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  },
});
