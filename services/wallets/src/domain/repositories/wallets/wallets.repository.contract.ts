import type { Player } from "@/domain/entities/player";
import { Transaction } from "@/domain/entities/transaction";
import { Wallet } from "@/domain/entities/wallet";
import { createWalletDto } from "@dtos/wallet.dto";

export interface IWalletsRepository {
  createWallet({ playerId, balance }: createWalletDto): Promise<Wallet>;
  getWalletByPlayerId(playerId: string): Promise<Wallet | null>;
  // getByPlayerId(playerId: string): Promise<Wallet | null>;
  // creditTransaction(
  //   transactionId: string,
  //   walletId: string,
  //   amount: bigint,
  // ): Promise<Transaction>;
  // debitTransaction(
  //   transactionId: string,
  //   walletId: string,
  //   amount: bigint,
  // ): Promise<Transaction>;
}

export abstract class WalletsRepositoryContract implements IWalletsRepository {
  abstract createWallet({
    playerId,
    balance,
  }: createWalletDto): Promise<Wallet>;
  abstract getWalletByPlayerId(playerId: string): Promise<Wallet | null>;
  // abstract creditTransaction(
  //   transactionId: string,
  //   walletId: string,
  //   amount: bigint,
  // ): Promise<Transaction>;
  // abstract debitTransaction(
  //   transactionId: string,
  //   walletId: string,
  //   amount: bigint,
  // ): Promise<Transaction>;
}
