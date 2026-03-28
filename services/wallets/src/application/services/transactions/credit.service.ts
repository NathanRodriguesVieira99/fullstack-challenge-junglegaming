import {
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type {
  CreditRequestDto,
  CreditResponseDto,
} from "../../../presentation/dtos/credit.dto";

import type { ClientKafka } from "@nestjs/microservices";
import { KAFKA_CLIENTS, KAFKA_TOPICS } from "../../../constants/kafka";

import { TransactionRepositoryContract } from "../../../domain/repositories/transactions/transactions.repository.contract";
import { Decimal } from "@prisma/client/runtime/client";

@Injectable()
export class CreditService {
  constructor(
    @Inject(KAFKA_CLIENTS.PRODUCER)
    private readonly kafka: ClientKafka,
    private readonly repo: TransactionRepositoryContract,
  ) {}
  async execute({
    transactionId,
    transactionValue,
    walletId,
    playerId,
  }: CreditRequestDto): Promise<CreditResponseDto> {
    if (!walletId) {
      throw new UnauthorizedException(
        "Not allowed to complete the transaction!",
      );
    }

    if (!playerId) {
      throw new UnauthorizedException(
        "Not allowed to complete the transaction!",
      );
    }

    const value = new Decimal(transactionValue);
    if (value.lt(1)) {
      throw new UnauthorizedException("The minimal value to bet is 1.00");
    }
    
    if (value.gt(1000)) {
      throw new UnauthorizedException("The max value to bet is 1000.00");
    }

    const transaction = await this.repo.creditTransaction({
      transactionId,
      transactionValue,
      walletId,
      playerId,
    });

    this.kafka.emit(KAFKA_TOPICS.CREDIT_TRANSACTION, {
      transaction: transactionId,
      wallet: walletId,
      player: playerId,
      credited_value: transactionValue,
    });

    return transaction;
  }
}
