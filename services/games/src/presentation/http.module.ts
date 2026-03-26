import { Module } from "@nestjs/common";

import { BetService } from "@services/games/bet/bet.service";
import { BetsService } from "@services/games/bets/bets.service";
import { RoundsService } from "@services/games/rounds/rounds.service";

import { HealthController } from "@controllers/health/health.controller";
import { betController } from "@controllers/games/bet/bet.controller";
import { betsController } from "@controllers/games/bets/bets.controller";
import { roundsController } from "@controllers/games/rounds/rounds.controller";

@Module({
  controllers: [
    HealthController,
    betController,
    betsController,
    roundsController,
  ],
  providers: [BetService, BetsService, RoundsService],
})
export class httpModule {}
