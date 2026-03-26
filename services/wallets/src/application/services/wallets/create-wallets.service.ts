import { Injectable } from "@nestjs/common";
import type { WalletsRepositoryImplementation } from "@repos/wallets/wallets.repository.implementation";
import type { DatabaseService } from "@db/database.service";

@Injectable()
export class CreateWalletService {
  constructor(
    private readonly repo: WalletsRepositoryImplementation,
    private readonly db: DatabaseService,
  ) {}

  async execute() {}
}
