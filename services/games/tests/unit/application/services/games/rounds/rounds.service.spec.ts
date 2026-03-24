import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { RoundsService } from "../../../../../../src/application/services/games/rounds/rounds.service";

describe("Rounds Service", () => {
  let service: RoundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundsService],
    }).compile();

    service = module.get<RoundsService>(RoundsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
