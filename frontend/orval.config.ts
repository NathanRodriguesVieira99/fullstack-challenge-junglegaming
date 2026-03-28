import { defineConfig } from "orval";

export default defineConfig({
  wallets: {
    input: "../services/wallets/swagger.json",
    output: {
      baseUrl: process.env.BASE_URL || "http://localhost:4002",
      client: "react-query",
      httpClient: "axios",
      target: "src/api/http/generated/wallets.ts",
      mode: "tags-split",
      namingConvention: "kebab-case",
      indexFiles: true,
      clean: true,
    },
  },
});
