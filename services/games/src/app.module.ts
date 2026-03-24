import { Module } from "@nestjs/common";

import { GamesController } from "@controllers/games/games.controller";
import { HealthController } from "@controllers/health/health.controller";

import { BetService } from "@services/games/bet/bet.service";
import { BetsService } from "@services/games/bets/bets.service";
import { RoundsService } from "@services/games/rounds/rounds.service";

@Module({
  controllers: [GamesController, HealthController],
  providers: [BetService, BetsService, RoundsService],
})
export class AppModule {}
