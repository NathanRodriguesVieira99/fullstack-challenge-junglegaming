import { ClientsModule, Transport } from "@nestjs/microservices";
import { Module } from "@nestjs/common";

import { HealthController } from "./controllers/health/health.controller";
import { GetWalletController } from "./controllers/wallets/get-wallet.controller";
import { CreateWalletController } from "./controllers/wallets/create-wallet.controller";

import { CreateWalletService } from "@/application/services/wallets/create-wallet.service";
import { GetWalletService } from "@/application/services/wallets/get-wallet.service";

import { WalletsRepositoryContract } from "@/domain/repositories/wallets/wallets.repository.contract";
import { WalletsRepositoryImplementation } from "@/domain/repositories/wallets/wallets.repository.implementation";

@Module({
  imports: [
    /* usado para transformar o service em producer */
    ClientsModule.register([
      {
        name: "wallets-producer",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "WALLETS_SERVICE_PRODUCER",
            brokers: ["kafka:29092"], // fora do Docker => localhost:9092
          },
        },
      },
    ]),
  ],
  controllers: [HealthController, GetWalletController, CreateWalletController],
  providers: [
    {
      provide: WalletsRepositoryContract,
      useClass: WalletsRepositoryImplementation,
    },
    CreateWalletService,
    GetWalletService,
  ],
})
export class httpModule {}
