import {
  Req,
  Controller,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/client";
import { JwtGuard } from "../../../infrastructure/auth/jwt/jwt.guard";
import { CreateWalletResponseDto } from "../../../presentation/dtos/wallet.dto";
import { CreateWalletService } from "../../../application/services/wallets/create-wallet.service";

import type { Request } from "express";

@ApiTags("Wallets")
@UseGuards(JwtGuard)
@Controller("wallets")
export class CreateWalletController {
  constructor(private readonly service: CreateWalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "createWallet",
    summary: "Create a new wallet for the player",
    description:
      "Creates a new wallet for the authenticated player with an initial balance of 1000.00. Each player can only have one wallet.",
  })
  @ApiCreatedResponse({
    description: "Wallet successfully created with initial balance",
    type: CreateWalletResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing JWT token",
  })
  @ApiConflictResponse({
    description: "Conflict - Player already has an existing wallet",
  })
  create(@Req() req: { user: { userId: string } }) {
    const playerId = req.user.userId;
    return this.service.execute({ playerId, balance: new Decimal(1000) });
  }
}
