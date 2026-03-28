import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DatabaseService } from "../../../infrastructure/database/database.service";

import type {
  DebitRequestDto,
  DebitResponseDto,
} from "../../../presentation/dtos/debit.dto";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../../infrastructure/database/generated/enums";
import type {
  CreditRequestDto,
  CreditResponseDto,
} from "../../../presentation/dtos/credit.dto";
import { Decimal } from "@prisma/client/runtime/client";
import type { TransactionRepositoryContract } from "./transactions.repository.contract";

@Injectable()
export class TransactionsRepositoryImplementation implements TransactionRepositoryContract {
  constructor(private readonly db: DatabaseService) {}

  async creditTransaction({
    transactionValue,
    playerId,
    transactionId,
    walletId,
  }: CreditRequestDto): Promise<CreditResponseDto> {
    const creditTransaction = await this.db.$transaction(
      async (): Promise<CreditResponseDto> => {
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

        const value = Decimal(new Decimal(transactionValue));

        if (value.lt(1))
          throw new UnauthorizedException("The minimal value to bet is 1.00");
        if (value.gt(1000))
          throw new UnauthorizedException("The max value to bet is 1000.00");

        await this.db.wallet.update({
          where: {
            id: walletId,
          },
          data: {
            balance: {
              increment: value,
            },
          },
        });

        const transaction = await this.db.transaction.create({
          data: {
            id: transactionId,
            type: TRANSACTION_TYPE.CREDIT,
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
    return creditTransaction;
  }

  async debitTransaction({
    transactionId,
    transactionValue,
    playerId,
    walletId,
  }: DebitRequestDto): Promise<DebitResponseDto> {
    const debitTransaction = await this.db.$transaction(
      async (): Promise<DebitResponseDto> => {
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

        const value = Decimal(transactionValue);

        if (value.lt(1))
          throw new UnauthorizedException("The minimal bet value is 1.00");

        if (value.gt(1000))
          throw new UnauthorizedException("The max bet value is 1000.00");

        if (wallet.balance.lt(value))
          throw new UnauthorizedException(
            "Not allowed to complete the transaction! The balance is insufficient!",
          );

        await this.db.wallet.update({
          where: {
            id: walletId,
          },
          data: {
            balance: {
              decrement: value,
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
