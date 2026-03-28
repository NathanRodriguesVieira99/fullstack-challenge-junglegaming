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
    summary: "Retorna a carteira do jogador autenticado",
    description:
      "Retorna os detalhes da carteira associada ao jogador autenticado, incluindo saldo atual, data de criação e última atualização.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Carteira retornada com sucesso",
    type: CreateWalletResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Não autorizado - Token JWT inválido ou ausente",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Carteira não encontrada para o jogador autenticado",
  })
  get(@Req() req: { user: { userId: string } }) {
    const playerId = req.user.userId;
    return this.service.execute(playerId);
  }
}
