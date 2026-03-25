import { Module } from "@nestjs/common";

import { HealthController } from "./controllers/health/health.controller";
import { getWalletsController } from "./controllers/wallets/get-wallet.controller";
import { createWalletsController } from "./controllers/wallets/create-wallets.controller";

import { CreateWalletsService } from "@/application/services/wallets/create-wallets.service";
import { GetWalletsService } from "@/application/services/wallets/get-wallet.service";

@Module({
  controllers: [
    HealthController,
    getWalletsController,
    createWalletsController,
  ],
  providers: [CreateWalletsService, GetWalletsService],
})
export class httpModule {}
