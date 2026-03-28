import { env } from "./src/_config/env";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
