import { ClientsModule, Transport } from "@nestjs/microservices";
import { Module } from "@nestjs/common";

import {
  KAFKA_BROKER,
  KAFKA_CLIENTS,
  KAFKA_CLIENTS_IDS,
} from "@/constants/kafka";

/* Services */
import { CreateBetService } from "@/application/services/games/bet/create-bet.service";
import { BetsHistoryService } from "@/application/services/games/bets/bets-history.service";
import { RoundsService } from "@services/games/rounds/rounds.service";

/* Controllers */
import { HealthController } from "@controllers/health/health.controller";
import { CreateBetController } from "@/presentation/controllers/games/bet/create-bet.controller";
import { BetsHistoryController } from "@/presentation/controllers/games/bets/bets-history.controller";
import { RoundsController } from "@controllers/games/rounds/rounds.controller";

/* Repositories */
import { BetsRepositoryContract } from "@/domain/repositories/bets/bets.repository.contract";
import { BetsRepositoryImplementation } from "@/domain/repositories/bets/bets.repository.implementation";

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
  providers: [
    CreateBetService,
    BetsHistoryService,
    RoundsService,
    {
      provide: BetsRepositoryContract,
      useClass: BetsRepositoryImplementation,
    },
  ],
  controllers: [
    HealthController,
    CreateBetController,
    BetsHistoryController,
    RoundsController,
  ],
})
export class httpModule {}
