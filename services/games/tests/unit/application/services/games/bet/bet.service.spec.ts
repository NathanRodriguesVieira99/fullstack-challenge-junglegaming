import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { BetService } from "../../../../../../src/application/services/games/bet/bet.service";

describe("Bet Service", () => {
  let service: BetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetService],
    }).compile();

    service = module.get<BetService>(BetService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
