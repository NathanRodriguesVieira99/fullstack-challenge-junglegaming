import { MessagePattern, Payload } from "@nestjs/microservices";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { DebitService } from "../../../application/services/transactions/debit.service";

import type {
  TransactionRequestDto,
  TransactionResponseDto,
} from "../../dtos/transaction.dto";

@ApiTags("Wallets - Transaction Processing (Kafka)")
@Controller("debit")
export class DebitController {
  constructor(private readonly service: DebitService) {}

  @MessagePattern("debit.transaction")
  @ApiOperation({
    operationId: "processDebitTransaction",
    summary: "Process debit transaction via Kafka",
    description:
      "Internal Kafka consumer endpoint for processing debit transactions. Debits funds from a player's wallet and records the transaction with idempotency.",
  })
  async debit(
    @Payload() payload: TransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.service.execute(payload);
  }
}
