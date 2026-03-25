import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { betController } from "../../../../src/presentation/controllers/games/bet/bet.controller";

describe("BetController", () => {
  let controller: betController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [betController],
    }).compile();

    controller = module.get<betController>(betController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
