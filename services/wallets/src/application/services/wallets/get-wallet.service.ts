import { Injectable } from "@nestjs/common";
import { WalletsRepositoryImplementation } from "@repos/wallets/wallets.repository.implementation";

@Injectable()
export class GetWalletService {
  constructor(private readonly repo: WalletsRepositoryImplementation) {}

  async execute(playerId: string) {
    return await this.repo.getWalletByPlayerId(playerId);
  }
}
