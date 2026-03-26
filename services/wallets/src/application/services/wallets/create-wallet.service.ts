import { WalletsRepositoryContract } from "../../../domain/repositories/wallets/wallets.repository.contract";
import type { createWalletDto } from "../../../presentation/dtos/wallet.dto";
import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class CreateWalletService {
  constructor(
    private readonly repo: WalletsRepositoryContract,
    @Inject("wallets-producer") private readonly kafka: ClientKafka,
  ) {}

  async execute({ playerId, balance }: createWalletDto) {
    const wallet = await this.repo.createWallet({ playerId, balance });

    this.kafka.emit("wallet.created", { playerId, walletId: wallet.id });

    return wallet;
  }
}
