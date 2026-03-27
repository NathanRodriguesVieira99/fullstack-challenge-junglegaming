import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    environment: "node",
    root: "./",
    globals: true,
    fileParallelism: false,
    testTimeout: 60000,
    hookTimeout: 30000,
    maxWorkers: 1,
    maxConcurrency: 1,

    coverage: {
      reportsDirectory: "./coverage",
      provider: "v8",
      reporter: ["text", "html", "lcov", "cobertura"],
      include: ["src/**/*.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  },
});
