import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../../_config/env";

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: env.DATABASE_URL,
    });

    super({
      adapter,
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  /**
    Criei essa função apenas para fins de facilitar o manuseio dos dados do prisma, 
    ela vai sempre limpar o banco para evitar conflitos ao usar o usuário de teste do keycloak
    */
  async reset() {
    await this.wallet.deleteMany();
    Logger.log("[Wallets] Database reset !");
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.reset();
      Logger.log("[Wallets] Database connection OK!");
    } catch (err) {
      Logger.error(`[Wallets] Database connection failed ${err}`);
      throw err;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      Logger.log("[Wallets] Database disconnected!");
    } catch (err) {
      Logger.error(`[Wallets] Error disconnecting database: ${err}`);
    }
  }
}
