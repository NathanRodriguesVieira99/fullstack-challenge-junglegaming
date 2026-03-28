import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
} from "@nestjs/common";

import { MessagePattern, Payload } from "@nestjs/microservices";
import { KAFKA_TOPICS } from "@/constants/kafka";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { BetsHistoryService } from "@/application/services/games/bets/bets-history.service";
import type { Decimal } from "@prisma/client/runtime/client";
import type { PaginationQuery } from "@/presentation/dtos/bet.dto";

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
    console.log("Mensagem recebida do Wallets Service", message);
    const playerId = message.playerId;
    console.log(playerId);
  }

  @Get("bets/me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "betsHistory",
    summary: "Busca o histórico das apostas pertencentes ao jogador",
  })
  @MessagePattern(KAFKA_TOPICS.DEBIT_TRANSACTION)
  async getBetsHistory(
    @Query() queryParams: PaginationQuery,
    @Param() playerId: string,
  ) {
    return await this.service.execute(queryParams, playerId);
  }
}
