import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { BetsService } from "../../../../../../src/application/services/games/bets/bets.service";

describe("Bets Service", () => {
  let service: BetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetsService],
    }).compile();

    service = module.get<BetsService>(BetsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
