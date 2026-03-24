import { Controller, Get, Post } from "@nestjs/common";

@Controller("wallets")
export class WalletsController {
  @Post()
  async createPlayerWallet() {}

  @Get("me")
  async getPlayerBalance() {}
}
