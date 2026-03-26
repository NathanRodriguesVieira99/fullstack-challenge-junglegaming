import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { CreateWalletService } from "../../../../../src/application/services/wallets/create-wallet.service";
import { WalletsRepositoryContract } from "../../../../../src/domain/repositories/wallets/wallets.repository.contract";
import { createWalletDto } from "@/presentation/dtos/wallet.dto";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

const mockWalletRepository = {
  createWallet: vi.fn(),
};

const mockKafkaProducer = {
  emit: vi.fn(),
};

const wallet: createWalletDto & { id: string } = {
  id: "uuid-super-aleatório",
  playerId: "player123",
  balance: 1000n,
};

describe("CreateWalletService", () => {
  let service: CreateWalletService;

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

    service = module.get<CreateWalletService>(CreateWalletService);
  });

  describe("Create Wallet", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    describe("Kafka", () => {
      it('should emit "wallet.created" kafka event', async () => {
        mockWalletRepository.createWallet.mockResolvedValue(wallet);
        mockKafkaProducer.emit.mockResolvedValue(undefined);

        await service.execute(wallet);

        expect(mockKafkaProducer.emit).toHaveBeenCalledWith("wallet.created", {
          playerId: wallet.playerId,
          walletId: wallet.id,
        });
      });
    });

    describe("Happy-Paths", () => {
      it("should create a wallet with initial balance of 1000", async () => {
        mockWalletRepository.createWallet.mockResolvedValue(wallet);

        const result = await service.execute(wallet);

        expect(result).toHaveProperty("balance");
        expect(result).toHaveProperty("playerId");
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

        await expect(service.execute(wallet)).rejects.toThrow(
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

        await expect(service.execute(balanceNegative)).rejects.toThrow(
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

        await expect(service.execute(balanceOverOneThousand)).rejects.toThrow(
          new UnauthorizedException("Balance should not be negative"),
        );
      });

      it("should throw Not Found Exception when user not exists", async () => {
        const invalidData = {
          balance: 100n,
          playerId: "",
        };

        mockWalletRepository.createWallet.mockRejectedValueOnce(
          new NotFoundException("User not found"),
        );

        await expect(service.execute(invalidData)).rejects.toThrow(
          new NotFoundException("User not found"),
        );
      });
    });
  });
});
