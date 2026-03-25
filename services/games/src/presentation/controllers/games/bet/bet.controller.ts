import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("games")
@ApiTags("Bet")
export class betController {
  @Post("bet")
  async bet() {}

  @Post("bet/cashout")
  async cashout() {}
}
