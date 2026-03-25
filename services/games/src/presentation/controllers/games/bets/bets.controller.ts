import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("games")
@ApiTags("Bets")
export class betsController {
  @Get("bets/me")
  async bets() {}
}
