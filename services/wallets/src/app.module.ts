import { Module } from "@nestjs/common";

import { HealthController } from "@controllers/health/health.controller";
import { WalletsController } from "@controllers/wallets/wallets.controller";

import { CreateWalletsService } from "@services/wallets/create-wallets.service";
import { GetWalletsService } from "@services/wallets/get-wallet.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    /* usado para transformar o service em producer */
    ClientsModule.register([
      {
        name: "wallets-producer",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["kafka:29092"], // fora do Docker => localhost:9092
          },
        },
      },
    ]),
  ],
  controllers: [HealthController, WalletsController],
  providers: [CreateWalletsService, GetWalletsService],
})
export class AppModule {}
