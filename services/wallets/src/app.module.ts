import { Module } from "@nestjs/common";

import { HealthController } from "@controllers/health/health.controller";
import { WalletsController } from "@controllers/wallets/wallets.controller";

import { CreateWalletsService } from "@services/wallets/create-wallets.service";
import { GetWalletsService } from "@services/wallets/get-wallet.service";

@Module({
  controllers: [HealthController, WalletsController],
  providers: [CreateWalletsService, GetWalletsService],
})
export class AppModule {}
