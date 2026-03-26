import { Module } from "@nestjs/common";

import { HealthController } from "./controllers/health/health.controller";
import { GetWalletController } from "./controllers/wallets/get-wallet.controller";
import { CreateWalletController } from "./controllers/wallets/create-wallet.controller";

import { CreateWalletService } from "@/application/services/wallets/create-wallets.service";
import { GetWalletService } from "@/application/services/wallets/get-wallet.service";

@Module({
  controllers: [HealthController, GetWalletController, CreateWalletController],
  providers: [CreateWalletService, GetWalletService],
})
export class httpModule {}
