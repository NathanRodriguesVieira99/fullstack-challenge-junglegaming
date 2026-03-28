import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateBetController } from "../../../../src/presentation/controllers/games/bet/create-bet.controller";

describe.skip("CreateBetController", () => {
  let controller: CreateBetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateBetController],
    }).compile();

    controller = module.get<CreateBetController>(CreateBetController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
