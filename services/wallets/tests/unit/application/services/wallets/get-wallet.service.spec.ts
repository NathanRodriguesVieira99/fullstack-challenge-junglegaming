import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { GetWalletService } from "../../../../../src/application/services/wallets/get-wallet.service";

describe("GetWalletService", () => {
  let service: GetWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetWalletService],
    }).compile();

    service = module.get<GetWalletService>(GetWalletService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
