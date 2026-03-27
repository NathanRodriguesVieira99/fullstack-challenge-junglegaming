import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DatabaseService } from "../../../infrastructure/database/database.service";

import type { TransactionRepositoryContract } from "./transactions.repository.contract";
import type {
  TransactionRequestDto,
  TransactionResponseDto,
} from "../../../presentation/dtos/transaction.dto";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/infrastructure/database/generated/enums";
import { Decimal } from "@prisma/client/runtime/client";

@Injectable()
export class TransactionsRepositoryImplementation implements TransactionRepositoryContract {
  constructor(private readonly db: DatabaseService) {}

  // async creditTransaction(
  //   id: string,
  //   walletId: string,
  //   value: Decimal,
  // ): Promise<Transaction> {}

  async debitTransaction({
    transactionId,
    transactionValue,
    playerId,
    walletId,
  }: TransactionRequestDto): Promise<TransactionResponseDto> {
    const debitTransaction = await this.db.$transaction(
      async (): Promise<TransactionResponseDto> => {
        const wallet = await this.db.wallet.findFirst({
          where: {
            id: walletId,
          },
          include: {
            player: true,
          },
        });

        if (!wallet || wallet.playerId !== playerId)
          throw new UnauthorizedException(
            "Not allowed to complete the transaction!",
          );

        if (wallet.balance.lt(0))
          throw new UnauthorizedException(
            "Not allowed to complete the transaction! The balance is negative!",
          );

        if (wallet.balance < transactionValue)
          throw new UnauthorizedException(
            "Not allowed to complete the transaction! The balance is insufficient!",
          );

        await this.db.wallet.update({
          where: {
            id: walletId,
          },
          data: {
            balance: {
              decrement: new Decimal(transactionValue),
            },
          },
        });

        const transaction = await this.db.transaction.create({
          data: {
            id: transactionId,
            type: TRANSACTION_TYPE.DEBIT,
            status: TRANSACTION_STATUS.CONFIRMED,
            transactionValue,
            walletId,
          },
        });

        const currentBalance = wallet.balance;

        return {
          transactionId: transaction.id,
          walletId,
          playerId,
          transactionValue: transaction.transactionValue,
          currentBalance,
          createdAt: transaction.createdAt,
          type: transaction.type,
        };
      },
    );
    return debitTransaction;
  }
}
