import { Inject, Injectable } from "@nestjs/common";
import { WalletsRepositoryContract } from "../../../domain/repositories/wallets/wallets.repository.contract";

import type { CreateWalletRequestDto } from "../../../presentation/dtos/wallet.dto";
import type { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class CreateWalletService {
  constructor(
    private readonly repo: WalletsRepositoryContract,
    @Inject("wallets-producer") private readonly kafka: ClientKafka,
  ) {}

  async execute({ playerId, balance }: CreateWalletRequestDto) {
    const wallet = await this.repo.createWallet({ playerId, balance });

    this.kafka.emit("wallet.created", { playerId, walletId: wallet.id });

    return wallet;
  }
}
