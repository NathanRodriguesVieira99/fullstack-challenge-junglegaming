import { JwtGuard } from "@/infrastructure/auth/jwt/jwt.guard";
import { createWalletDto } from "@/presentation/dtos/wallet.dto";
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
import { GetWalletService } from "@services/wallets/get-wallet.service";

@ApiTags("Wallets")
@Controller("wallets")
export class GetWalletController {
  constructor(private readonly service: GetWalletService) {}

  @Get("me")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "GetWallet",
    summary: "Obter carteira do jogador",
    description: "Retorna os dados da carteira do jogador autenticado",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Carteira retornada com sucesso",
    type: createWalletDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Usuário não autorizado (Token JWT inválido ou ausente)",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Carteira não encontrada",
  })
  get(@Req() req: { user: { userId: string } }) {
    const playerId = req.user.userId;
    return this.service.execute(playerId);
  }
}
