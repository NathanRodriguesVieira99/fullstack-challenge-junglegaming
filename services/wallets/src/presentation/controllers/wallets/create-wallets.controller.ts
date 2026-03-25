import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("wallets")
@ApiTags("Wallets")
export class createWalletsController {
  @Post()
  async createPlayerWallet() {}
}
