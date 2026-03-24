import { Module } from "@nestjs/common";

import { ClientsModule, Transport } from "@nestjs/microservices";

import { GamesController } from "@controllers/games/games.controller";
import { HealthController } from "@controllers/health/health.controller";

import { BetService } from "@services/games/bet/bet.service";
import { BetsService } from "@services/games/bets/bets.service";
import { RoundsService } from "@services/games/rounds/rounds.service";

@Module({
  imports: [
    /* usado para transformar o service em producer */
    ClientsModule.register([
      {
        name: "games-producer",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["kafka:29092"], // fora do Docker => localhost:9092
          },
        },
      },
    ]),
  ],
  controllers: [GamesController, HealthController],
  providers: [BetService, BetsService, RoundsService],
})
export class AppModule {}
