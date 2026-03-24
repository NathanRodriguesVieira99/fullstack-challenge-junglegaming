import { Controller, Get, Post } from "@nestjs/common";

@Controller("games")
export class GamesController {
  @Get("rounds/current")
  async currentRound() {}

  @Get("rounds/history")
  async roundHistory() {}

  @Get("rounds/:roundId/verify")
  async verify() {}

  @Get("bets/me")
  async bets() {}

  @Post("bet")
  async bet() {}

  @Post("bet/cashout")
  async cashout() {}
}
