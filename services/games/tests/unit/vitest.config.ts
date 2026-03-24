import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    reporters: ["verbose"],
    environment: "node",
    root: "./",
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    testTimeout: 10000,

    coverage: {
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov", "cobertura"],
      provider: "v8",
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
        "**/*.e2e-spec.ts",
        "**/*.controller.ts",
        "**/*.entity.ts",
        "**/*.decorator.ts",
        "**/*.guard.ts",
      ],

      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
