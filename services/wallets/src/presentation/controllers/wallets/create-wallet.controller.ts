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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtGuard } from "@/infrastructure/auth/jwt/jwt.guard";
import { CreateWalletService } from "@/application/services/wallets/create-wallet.service";
import { createWalletDto } from "@/presentation/dtos/wallet.dto";

@ApiTags("Wallets")
@UseGuards(JwtGuard)
@Controller("wallets")
export class CreateWalletController {
  constructor(private readonly service: CreateWalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "CreateWallet",
    description: "Cria uma carteira para o jogador",
    summary:
      "Cria uma carteira para usuário autenticado com 1000 de saldo inicial",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Carteira criada com sucesso",
    type: createWalletDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Usuário não autorizado (Token JWT inválido ou ausente)",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Usuário já possui uma carteira",
  })
  create(@Req() req: { user: { userId: string } }) {
    const playerId = req.user.userId;
    return this.service.execute({ playerId, balance: 1000n });
  }
}
