import { WalletsRepositoryContract } from "../../../domain/repositories/wallets/wallets.repository.contract";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetWalletService {
  constructor(private readonly repo: WalletsRepositoryContract) {}

  async execute(playerId: string) {
    return await this.repo.getWalletByPlayerId(playerId);
  }
}
