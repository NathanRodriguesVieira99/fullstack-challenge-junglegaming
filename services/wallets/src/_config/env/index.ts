import "dotenv/config";
import z from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.url().startsWith("postgresql://"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  if (process.env.NODE_ENV === "development") {
    console.error(
      "❌ Erro ao validar variáveis de ambiente!",
      z.treeifyError(_env.error),
    );
  }
  throw new Error("❌ Variáveis de ambiente inválidas!");
}

export const env = _env.data;
