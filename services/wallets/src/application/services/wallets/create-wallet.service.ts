import { Inject, Injectable } from "@nestjs/common";

import type { ClientKafka } from "@nestjs/microservices";
import { KAFKA_CLIENTS } from "../../../constants/kafka";
import { KAFKA_TOPICS } from "../../../constants/kafka";

import { WalletsRepositoryContract } from "../../../domain/repositories/wallets/wallets.repository.contract";
import { CreateWalletRequestDto } from "../../../presentation/dtos/wallet.dto";

@Injectable()
export class CreateWalletService {
  constructor(
    private readonly repo: WalletsRepositoryContract,
    @Inject(KAFKA_CLIENTS.PRODUCER) private readonly kafka: ClientKafka,
  ) {}

  async execute({ playerId, balance }: CreateWalletRequestDto) {
    const wallet = await this.repo.createWallet({ playerId, balance });

    this.kafka.emit(KAFKA_TOPICS.WALLET_CREATED, {
      playerId,
      walletId: wallet.id,
    });

    return wallet;
  }
}
