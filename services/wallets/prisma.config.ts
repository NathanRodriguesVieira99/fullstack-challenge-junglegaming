import { env } from "./src/_config/env";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma",
  migrations: {
    /*
   migrations devem ser geradas
   via `docker compose wallets sh` pois o postgresql está configurado para rodar via Docker.
    */
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
