import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { JwtGuard } from "../../../infrastructure/auth/jwt/jwt.guard";
import { CreditService } from "../../../application/services/transactions/credit.service";

@ApiTags("Wallets - Credit")
// @ApiBearerAuth()
// @UseGuards(JwtGuard)
@Controller("wallets")
export class CreditController {
  constructor(private readonly service: CreditService) {}

  @Post("credit")
  credit(@Req() req: Request & { user: { userId: string } }) {
    // const playerId = req.user.userId;
    return this.service.execute(); // { playerId }
  }
}
