import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";

import { BetsHistoryService } from "../../../../../../src/application/services/games/bets/bets-history.service";
import { BetsRepositoryContract } from "../../../../../../src/domain/repositories/bets/bets.repository.contract";

import { PaginationQuery } from "../../../../../../src/presentation/dtos/bet.dto";

import { paginatedBets } from "./utils/paginated-bets";

const { mockBetsRepository } = vi.hoisted(() => ({
  mockBetsRepository: {
    betsHistory: vi.fn(),
  },
}));

describe("Bets Service", () => {
  let service: BetsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetsHistoryService,
        { provide: BetsRepositoryContract, useValue: mockBetsRepository },
      ],
    }).compile();

    service = module.get<BetsHistoryService>(BetsHistoryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Happy-Path", () => {
    it("should list all bets", async () => {
      mockBetsRepository.betsHistory.mockResolvedValue(paginatedBets);

      const queryParams: PaginationQuery = {
        page: 1,
        limit: 10,
      };

      const playerId = faker.string.uuid();

      const result = await service.execute(queryParams, playerId);

      expect(result.data).toHaveLength(paginatedBets.data.length);
      expect(result.meta.total_items).toBe(paginatedBets.meta.total_items);
    });
  });
});
