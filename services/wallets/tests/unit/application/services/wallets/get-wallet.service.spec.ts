import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";

import { GetWalletService } from "../../../../../src/application/services/wallets/get-wallet.service";

import { WalletsRepositoryContract } from "../../../../../src/domain/repositories/wallets/wallets.repository.contract";

const { mockWalletRepository } = vi.hoisted(() => ({
  mockWalletRepository: {
    getWalletByPlayerId: vi.fn(),
  },
}));

const mockWallet = {
  id: "wallet-123",
  playerId: "player-456",
  balance: 1000n,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2024-02-01"),
  player: { id: "player-456", username: "player" },
  transactions: [],
};

describe("GetWalletService", () => {
  let sut: GetWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWalletService,
        {
          provide: WalletsRepositoryContract,
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    sut = module.get<GetWalletService>(GetWalletService);
  });

  describe("SUT", () => {
    it("should be defined", () => {
      expect(sut).toBeDefined();
    });
  });

  describe("Get Wallets Service", () => {
    describe("Happy-Paths", () => {
      it("should return wallet when playerId exists", async () => {
        mockWalletRepository.getWalletByPlayerId.mockResolvedValue(mockWallet);

        const result = await sut.execute("player123");

        expect(result).toEqual(mockWallet);
        expect(mockWalletRepository.getWalletByPlayerId).toHaveBeenCalledWith(
          "player123",
        );
      });

      it("should return wallet with transactions and player relations", async () => {
        const walletWithRelations = {
          ...mockWallet,
          transactions: [
            { id: "tx-1", amount: 1000n, type: "credit" },
            { id: "tx-2", amount: 500n, type: "debit" },
          ],
        };

        mockWalletRepository.getWalletByPlayerId.mockResolvedValue(
          walletWithRelations,
        );

        const result = await sut.execute("player123");

        expect(result?.transactions).toHaveLength(2);
        expect(result?.player).toBeDefined();
      });

      it("should return wallet with zero balance", async () => {
        const walletWithZeroBalance = { ...mockWallet, balance: 0n };

        mockWalletRepository.getWalletByPlayerId.mockResolvedValue(
          walletWithZeroBalance,
        );

        const result = await sut.execute("player123");
        expect(result?.balance).toBe(0n);
      });
    });

    describe("Errors", () => {
      it("should throw NotFoundException when wallet not found", async () => {
        mockWalletRepository.getWalletByPlayerId.mockRejectedValue(
          new NotFoundException("Wallet not found!"),
        );

        await expect(sut.execute("invalid-player")).rejects.toThrow(
          new NotFoundException("Wallet not found!"),
        );
      });
    });
  });
});
