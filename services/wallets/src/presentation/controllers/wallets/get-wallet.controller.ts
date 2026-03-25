import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("wallets")
@ApiTags("Wallets")
export class getWalletsController {
  @Get("me")
  async getPlayerBalance() {}
}
