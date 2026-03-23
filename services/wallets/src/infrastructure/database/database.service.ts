import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/_config/env";

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

  async onModuleInit() {
    try {
      await this.$connect();
      Logger.log("Database connection OK!");
    } catch (err) {
      Logger.error(`Database connection failed ${err}`);
      throw err;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      Logger.log("Database disconnected!");
    } catch (err) {
      Logger.error(`Error disconnecting database: ${err}`);
    }
  }
}
