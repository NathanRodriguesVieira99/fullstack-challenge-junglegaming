import { env } from "./src/_config/env";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma",
  migrations: {
    /*
     Pasta migrations gerada dentro do Docker pois rodei o script `bun prisma migrate dev` 
     via `docker compose wallets sh` pois o postgresql está configurado para rodar via Docker.
    */
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
