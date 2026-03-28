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
import {
  CreateWalletResponseDto,
} from "../../../presentation/dtos/wallet.dto";
import { CreateWalletService } from "../../../application/services/wallets/create-wallet.service";

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
    summary: "Cria uma nova carteira para o jogador",
    description:
      "Cria uma nova carteira para o jogador autenticado com saldo inicial de 1000.00. Cada jogador pode ter apenas uma carteira.",
  })
  @ApiCreatedResponse({
    description: "Carteira criada com sucesso com saldo inicial",
    type: CreateWalletResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Não autorizado - Token JWT inválido ou ausente",
  })
  @ApiConflictResponse({
    description: "Conflito - Jogador já possui uma carteira",
  })
  create(@Req() req: { user: { userId: string } }) {
    const playerId = req.user.userId;
    return this.service.execute({ playerId, balance: new Decimal(1000) });
  }
}
