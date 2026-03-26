import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { GetWalletService } from "../../../../../src/application/services/wallets/get-wallet.service";
import { WalletsRepositoryContract } from "../../../../../src/domain/repositories/wallets/wallets.repository.contract";

const mockWalletRepositoryImplementation = {
  getWalletByPlayerId: vi.fn(),
};

const mockKafkaProducer = {
  emit: vi.fn(),
};

describe("GetWalletService", () => {
  let service: GetWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWalletService,
        {
          provide: WalletsRepositoryContract,
          useValue: mockWalletRepositoryImplementation,
        },
        {
          provide: "wallets-producer",
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();

    service = module.get<GetWalletService>(GetWalletService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
