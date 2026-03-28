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
      exclude: [
        "**/types/**",
        "**/dto/**",
        "**/*.d.ts",
        "**/*.dto.ts",
        "**/mocks/**",
        "**/factories/**",
        "**/generated/**",
        "src/main.ts",
        "**/*.module.ts",
        "**/*.repository.*.ts",
        "**/*.service.ts",
        "**/*.spec.ts",
        "**/*.entity.ts",
        "**/*.decorator.ts",
        "**/*.guard.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  },
});
