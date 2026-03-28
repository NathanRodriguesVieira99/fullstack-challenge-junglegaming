import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { MessagePattern, Payload } from "@nestjs/microservices";
import { KAFKA_TOPICS } from "../../../../constants/kafka";

import { ApiOperation, ApiTags, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { BetsHistoryService } from "../../../../application/services/games/bets/bets-history.service";
import { Decimal } from "@prisma/client/runtime/client";
import type { PaginationQuery } from "../../../dtos/bet.dto";
import { JwtGuard } from "../../../../infrastructure/auth/jwt/jwt.guard";

export interface DebitMessageContract {
  playerId: string;
  transactionId: string;
  walletId: string;
  transactionValue: Decimal;
}

@Controller("games")
@ApiTags("Bets")
export class betsHistoryController {
  constructor(private readonly service: BetsHistoryService) {}

  @MessagePattern(KAFKA_TOPICS.DEBIT_TRANSACTION)
  async kafkaMessage(@Payload() message: DebitMessageContract) {
    const playerId = message.playerId;
    console.log(playerId);
  }

  @UseGuards(JwtGuard)
  @Get("bets/me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "betsHistory",
    summary: "Busca o histórico das apostas pertencentes ao jogador",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Página atual",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Limite de dados por página",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "Dados paginados das apostas do jogador",
    schema: {
      example: {
        meta: {
          page: 1,
          limit: 10,
          total_items: 100,
          total_pages: 10,
        },
        data: [
          {
            id: "bet-id",
            betStatus: "WIN",
            amount: "100.00",
            cashedOutAt: "2024-01-01T00:00:00.000Z",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  })
  async getBetsHistory(
    @Query() queryParams: PaginationQuery,
    @Req() req: { user: { sub: string } },
  ) {
    const playerId = req.user?.sub;
    return await this.service.execute(queryParams, playerId);
  }
}
