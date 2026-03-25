import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { getWalletsController } from "../../../../../src/presentation/controllers/wallets/get-wallet.controller";

describe("BetController", () => {
  let controller: getWalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [getWalletsController],
    }).compile();

    controller = module.get<getWalletsController>(getWalletsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
