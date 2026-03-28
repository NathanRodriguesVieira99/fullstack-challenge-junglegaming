import { BetsRepositoryContract } from "@/domain/repositories/bets/bets.repository.contract";
import type { PaginationQuery } from "@/presentation/dtos/bet.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BetsHistoryService {
  constructor(private readonly repo: BetsRepositoryContract) {}

  async execute(queryParams: PaginationQuery, playerId: string) {
    return await this.repo.betsHistory(queryParams, playerId);
  }
}
