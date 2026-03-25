import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect } from "vitest";
import { createWalletsController } from "../../../../../src/presentation/controllers/wallets/create-wallets.controller";

describe("createWalletsController", () => {
  let controller: createWalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [createWalletsController],
    }).compile();

    controller = module.get<createWalletsController>(createWalletsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
