import { describe, beforeEach, it, expect, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateBetService } from "../../../../../../src/application/services/games/bet/create-bet.service";

import { KAFKA_CLIENTS } from "../../../../../../src/constants/kafka";
import { BetsRepositoryContract } from "../../../../../../src/domain/repositories/bets/bets.repository.contract";

describe("Bet Service", () => {
  let service: CreateBetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBetService,
        {
          provide: KAFKA_CLIENTS.PRODUCER,
          useValue: { emit: vi.fn() },
        },
        {
          provide: BetsRepositoryContract,
          useValue: { createBet: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<CreateBetService>(CreateBetService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
