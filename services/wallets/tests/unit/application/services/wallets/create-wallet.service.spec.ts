import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { CreateWalletService } from "../../../../../src/application/services/wallets/create-wallets.service";

describe("CreateWalletService", () => {
  let service: CreateWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateWalletService],
    }).compile();

    service = module.get<CreateWalletService>(CreateWalletService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
