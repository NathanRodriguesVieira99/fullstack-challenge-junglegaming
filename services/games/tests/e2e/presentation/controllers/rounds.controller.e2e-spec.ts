import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { roundsController } from "../../../../src/presentation/controllers/games/rounds/rounds.controller";

describe("RoundsController", () => {
  let controller: roundsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [roundsController],
    }).compile();

    controller = module.get<roundsController>(roundsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
