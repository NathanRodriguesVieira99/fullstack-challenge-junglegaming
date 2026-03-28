import { Wallet } from "@/domain/entities/wallet";

import {
  CreateWalletRequestDto,
  CreateWalletResponseDto,
} from "@dtos/wallet.dto";

export interface IWalletsRepository {
  createWallet({
    playerId,
    balance,
  }: CreateWalletRequestDto): Promise<CreateWalletResponseDto>;
  getWalletByPlayerId(playerId: string): Promise<Wallet | null>;
}

export abstract class WalletsRepositoryContract implements IWalletsRepository {
  abstract createWallet({
    playerId,
    balance,
  }: CreateWalletRequestDto): Promise<CreateWalletResponseDto>;
  abstract getWalletByPlayerId(playerId: string): Promise<Wallet | null>;
}
