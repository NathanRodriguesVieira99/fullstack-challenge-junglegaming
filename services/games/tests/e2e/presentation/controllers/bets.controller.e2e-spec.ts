import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { betsController } from "../../../../src/presentation/controllers/games/bets/bets.controller";

describe("BetsController", () => {
  let controller: betsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [betsController],
    }).compile();

    controller = module.get<betsController>(betsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
