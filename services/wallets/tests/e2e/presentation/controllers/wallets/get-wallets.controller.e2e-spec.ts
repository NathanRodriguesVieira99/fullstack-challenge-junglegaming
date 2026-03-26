import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { GetWalletController } from "../../../../../src/presentation/controllers/wallets/get-wallet.controller";

describe("GetWalletsController", () => {
  let controller: GetWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetWalletController],
    }).compile();

    controller = module.get<GetWalletController>(GetWalletController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
