import { Test, TestingModule } from "@nestjs/testing";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";

import { CreateWalletService } from "../../../../../src/application/services/wallets/create-wallet.service";

import { WalletsRepositoryContract } from "../../../../../src/domain/repositories/wallets/wallets.repository.contract";

// vi.hoisted => usado para isolar os mocks
const { mockWalletRepository, mockKafkaProducer } = vi.hoisted(() => ({
  mockWalletRepository: {
    createWallet: vi.fn(),
  },

  mockKafkaProducer: {
    emit: vi.fn(),
  },
}));

const wallet = {
  id: "uuid-super-aleatório",
  playerId: "player123",
  balance: 1000n,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2024-02-01"),
  player: { id: "player123", username: "player" },
  transactions: [],
};

describe("CreateWalletService", () => {
  let sut: CreateWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateWalletService,
        {
          provide: WalletsRepositoryContract,
          useValue: mockWalletRepository,
        },
        {
          provide: "wallets-producer",
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();

    sut = module.get<CreateWalletService>(CreateWalletService);
  });

  describe("SUT", () => {
    it("should be defined", () => {
      expect(sut).toBeDefined();
    });
  });

  describe("Create Wallet Service", () => {
    describe("Kafka", () => {
      it("should emit wallet.created event after creation", async () => {
        mockWalletRepository.createWallet.mockResolvedValue(wallet);
        mockKafkaProducer.emit.mockResolvedValue(undefined);

        await sut.execute(wallet);

        expect(mockKafkaProducer.emit).toHaveBeenCalledWith("wallet.created", {
          playerId: wallet.playerId,
          walletId: wallet.id,
        });
      });
    });

    describe("Happy-Paths", () => {
      it("should create a wallet with initial balance of 1000", async () => {
        mockWalletRepository.createWallet.mockResolvedValue(wallet);

        const result = await sut.execute(wallet);

        expect(result).toEqual(
          expect.objectContaining({
            id: "uuid-super-aleatório",
            playerId: "player123",
            balance: 1000n,
            createdAt: new Date("2026-01-01"),
            updatedAt: new Date("2024-02-01"),
            player: { id: "player123", username: "player" },
            transactions: [],
          }),
        );
        expect(result.balance).toBe(1000n);
      });
    });

    describe("Errors", () => {
      it("should throw Conflict Exception when create duplicated wallet", async () => {
        // cria pela primeira vez
        mockWalletRepository.createWallet.mockResolvedValue(wallet);

        // cria pela segunda vez
        mockWalletRepository.createWallet.mockRejectedValue(
          new ConflictException("Wallet already exists"),
        );

        await expect(sut.execute(wallet)).rejects.toThrow(
          new ConflictException("Wallet already exists"),
        );
      });

      it("should throw Unauthorized Exception when balance is < 1 ", async () => {
        const balanceNegative = {
          balance: 0n,
          playerId: "player123",
        };

        mockWalletRepository.createWallet.mockRejectedValueOnce(
          new UnauthorizedException("Balance should not be negative"),
        );

        await expect(sut.execute(balanceNegative)).rejects.toThrow(
          new UnauthorizedException("Balance should not be negative"),
        );
      });

      it("should throw Unauthorized Exception when balance is > 1000 ", async () => {
        const balanceOverOneThousand = {
          balance: 1001n,
          playerId: "player123",
        };

        mockWalletRepository.createWallet.mockRejectedValueOnce(
          new UnauthorizedException("Balance should not be negative"),
        );

        await expect(sut.execute(balanceOverOneThousand)).rejects.toThrow(
          new UnauthorizedException("Balance should not be negative"),
        );
      });
    });
  });
});
