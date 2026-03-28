import { Inject, Injectable } from "@nestjs/common";
import { TransactionRepositoryContract } from "../../../domain/repositories/transactions/transactions.repository.contract";

import {
  DebitRequestDto,
  DebitResponseDto,
} from "../../../presentation/dtos/debit.dto";

import type { ClientKafka } from "@nestjs/microservices";
import { KAFKA_CLIENTS, KAFKA_TOPICS } from "../../../constants/kafka";

@Injectable()
export class DebitService {
  constructor(
    @Inject(KAFKA_CLIENTS.PRODUCER) private readonly kafka: ClientKafka,
    private readonly repo: TransactionRepositoryContract,
  ) {}

  async execute({
    walletId,
    transactionId,
    playerId,
    transactionValue,
  }: DebitRequestDto): Promise<DebitResponseDto> {
    const amount = transactionValue;

    const transaction = await this.repo.debitTransaction({
      playerId,
      transactionId,
      walletId,
      transactionValue: amount,
    });

    this.kafka.emit(KAFKA_TOPICS.DEBIT_TRANSACTION, {
      transaction: transactionId,
      wallet: walletId,
      player: playerId,
      debited_value: amount,
    });

    return transaction;
  }
}
