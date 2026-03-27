import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtGuard } from "../../../infrastructure/auth/jwt/jwt.guard";
import { GetWalletService } from "../../../application/services/wallets/get-wallet.service";
import { CreateWalletResponseDto } from "../../dtos/wallet.dto";

import type { Request } from "express";

@ApiTags("Wallets")
@Controller("wallets")
export class GetWalletController {
  constructor(private readonly service: GetWalletService) {}

  @Get("me")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "getPlayerWallet",
    summary: "Get authenticated player's wallet",
    description:
      "Retrieves the wallet associated with the authenticated player. Returns wallet details including current balance, creation date, and last update timestamp.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Wallet successfully retrieved",
    type: CreateWalletResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - Invalid or missing JWT token",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Wallet not found for the authenticated player",
  })
  get(@Req() req: { user: { userId: string } }) {
    const playerId = req.user.userId;
    return this.service.execute(playerId);
  }
}
