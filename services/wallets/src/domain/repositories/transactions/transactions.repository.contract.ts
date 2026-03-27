import {
  TransactionResponseDto,
  TransactionRequestDto,
} from "@/presentation/dtos/transaction.dto";

export interface ITransactionRepository {
  // creditTransaction(
  //   playerId: string,
  //   transactionId: string,
  //   walletId: string,
  //   amount: Decimal,
  // ): Promise<TransactionDto>;
  debitTransaction({
    transactionValue,
    playerId,
    transactionId,
    walletId,
  }: TransactionRequestDto): Promise<TransactionResponseDto>;
}

export abstract class TransactionRepositoryContract implements ITransactionRepository {
  // abstract creditTransaction(
  //   playerId: string,
  //   transactionId: string,
  //   walletId: string,
  //   amount: Decimal,
  // ): Promise<TransactionDto>;
  abstract debitTransaction({
    transactionValue,
    playerId,
    transactionId,
    walletId,
  }: TransactionRequestDto): Promise<TransactionResponseDto>;
}
