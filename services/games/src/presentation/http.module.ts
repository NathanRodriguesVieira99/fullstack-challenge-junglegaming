import { ClientsModule, Transport } from "@nestjs/microservices";
import { Module } from "@nestjs/common";

import { BetService } from "@services/games/bet/bet.service";
import { BetsService } from "@services/games/bets/bets.service";
import { RoundsService } from "@services/games/rounds/rounds.service";

import { HealthController } from "@controllers/health/health.controller";
import { betController } from "@controllers/games/bet/bet.controller";
import { betsController } from "@controllers/games/bets/bets.controller";
import { roundsController } from "@controllers/games/rounds/rounds.controller";
import {
  KAFKA_BROKER,
  KAFKA_CLIENTS,
  KAFKA_CLIENTS_IDS,
} from "@/constants/kafka";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_CLIENTS.PRODUCER,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_CLIENTS_IDS.KAFKA_PRODUCER_CLIENT_ID,
            brokers: [KAFKA_BROKER],
          },
        },
      },
    ]),
  ],
  controllers: [
    HealthController,
    betController,
    betsController,
    roundsController,
  ],
  providers: [BetService, BetsService, RoundsService],
})
export class httpModule {}
