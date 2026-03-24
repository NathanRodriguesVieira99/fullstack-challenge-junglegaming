import { Controller, Get, Post } from "@nestjs/common";

@Controller("games")
export class GamesController {
  @Get("rounds")
  async currentRound() {}

  @Get("rounds/:roundId/verify")
  async roundHistory() {}

  @Get("rounds")
  async verify() {}

  @Get("bets")
  async bets() {}

  @Post("bet")
  async bet() {}

  @Post("bet/cashout")
  async cashout() {}
}
