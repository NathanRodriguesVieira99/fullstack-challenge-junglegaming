import {
  DebitResponseDto,
  DebitRequestDto,
} from "@/presentation/dtos/debit.dto";
import {
  CreditRequestDto,
  CreditResponseDto,
} from "@/presentation/dtos/credit.dto";
import type { Decimal } from "@prisma/client/runtime/client";

export interface ITransactionRepository {
  creditTransaction({
    transactionValue,
    playerId,
    transactionId,
    walletId,
  }: CreditRequestDto): Promise<CreditResponseDto>;

  debitTransaction({
    transactionValue,
    playerId,
    transactionId,
    walletId,
  }: DebitRequestDto): Promise<DebitResponseDto>;
}

export abstract class TransactionRepositoryContract implements ITransactionRepository {
  abstract creditTransaction({
    transactionValue,
    playerId,
    transactionId,
    walletId,
  }: CreditRequestDto): Promise<CreditResponseDto>;
  abstract debitTransaction({
    transactionValue,
    playerId,
    transactionId,
    walletId,
  }: DebitRequestDto): Promise<DebitResponseDto>;
}
