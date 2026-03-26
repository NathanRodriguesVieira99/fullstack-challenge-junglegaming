import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect } from "vitest";
import { CreateWalletController } from "../../../../../src/presentation/controllers/wallets/create-wallet.controller";

describe("createWalletController", () => {
  let controller: CreateWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateWalletController],
    }).compile();

    controller = module.get<CreateWalletController>(CreateWalletController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
