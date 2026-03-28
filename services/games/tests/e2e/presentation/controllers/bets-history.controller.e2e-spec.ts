import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { betsHistoryController } from "../../../../src/presentation/controllers/games/bets/bets-history.controller";

describe.skip("betsHistoryController", () => {
  let controller: betsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [betsHistoryController],
    }).compile();

    controller = module.get<betsHistoryController>(betsHistoryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
