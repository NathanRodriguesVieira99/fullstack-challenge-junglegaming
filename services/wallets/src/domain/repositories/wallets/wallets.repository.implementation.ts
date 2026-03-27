import type { Wallet } from "../../entities/wallet";
import type { WalletsRepositoryContract } from "./wallets.repository.contract";
import { DatabaseService } from "../../../infrastructure/database/database.service";
import { Transaction } from "@models/transaction";
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import type { createWalletDto } from "../../../presentation/dtos/wallet.dto";
import { Decimal } from "@prisma/client/runtime/client";

@Injectable()
export class WalletsRepositoryImplementation implements WalletsRepositoryContract {
  constructor(private readonly db: DatabaseService) {}

  async createWallet({ playerId, balance }: createWalletDto): Promise<Wallet> {
    const result = await this.db.$transaction(async () => {
      const playerExists = await this.db.wallet.findFirst({
        where: {
          playerId,
        },
      });

      if (playerExists) throw new ConflictException("Wallet already exists");

      const isDecimalBalance = new Decimal(balance);

      if (isDecimalBalance.lt(1000))
        throw new UnauthorizedException("Balance should not be negative");

      if (isDecimalBalance.gt(1000))
        throw new UnauthorizedException("Balance should not be over 1000");

      const wallet = await this.db.wallet.create({
        data: {
          playerId: playerId,
          balance: isDecimalBalance,
        },
        include: {
          player: true,
          transactions: true,
        },
      });

      return wallet;
    });
    return result;
  }

  async getWalletByPlayerId(playerId: string): Promise<Wallet> {
    const result = await this.db.$transaction(async (prisma) => {
      const wallet = await prisma.wallet.findUnique({
        where: { playerId },
        include: {
          transactions: true,
          player: true,
        },
      });

      if (!wallet) throw new NotFoundException("Wallet not found!");

      return wallet;
    });

    return result;
  }

  // async creditTransaction(
  //   id: string,
  //   walletId: string,
  //   amount: bigint,
  // ): Promise<Transaction> {}

  // async debitTransaction(
  //   transactionId: string,
  //   walletId: string,
  //   amount: bigint,
  // ): Promise<Transaction> {}
}
