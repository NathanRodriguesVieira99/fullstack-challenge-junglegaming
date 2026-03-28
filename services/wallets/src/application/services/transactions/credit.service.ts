import { Inject, Injectable } from "@nestjs/common";
import {
  CreditRequestDto,
  CreditResponseDto,
} from "../../../presentation/dtos/credit.dto";

import type { ClientKafka } from "@nestjs/microservices";
import { KAFKA_CLIENTS, KAFKA_TOPICS } from "../../../constants/kafka";

import { TransactionRepositoryContract } from "../../../domain/repositories/transactions/transactions.repository.contract";

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
    const amount = transactionValue;

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
      credited_value: amount,
    });

    return transaction;
  }
}
