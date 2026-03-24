import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect } from "vitest";
import { WalletsController } from "../../../../../src/presentation/controllers/wallets/wallets.controller";

describe("WalletsController", () => {
  let controller: WalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
