import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("games")
@ApiTags("Rounds")
export class roundsController {
  @Get("rounds/current")
  async currentRound() {}

  @Get("rounds/history")
  async roundHistory() {}

  @Get("rounds/:roundId/verify")
  async verify() {}
}
