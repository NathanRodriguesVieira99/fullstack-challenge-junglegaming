import { Inject, Injectable } from "@nestjs/common";
import { TransactionRepositoryContract } from "../../../domain/repositories/transactions/transactions.repository.contract";

import type { ClientKafka } from "@nestjs/microservices";
import type {
  DebitRequestDto,
  DebitResponseDto,
} from "../../../presentation/dtos/debit.dto";

@Injectable()
export class DebitService {
  constructor(
    @Inject("wallets-producer") private readonly kafka: ClientKafka,
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

    this.kafka.emit("debit.transaction", {
      transaction: transactionId,
      wallet: walletId,
      player: playerId,
      debited_value: amount,
    });

    return transaction;
  }
}
