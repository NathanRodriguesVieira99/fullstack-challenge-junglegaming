import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";

import { DebitService } from "../../../../../src/application/services/transactions/debit.service";
import { TransactionRepositoryContract } from "../../../../../src/domain/repositories/transactions/transactions.repository.contract";
import {
  DebitResponseDto,
  type DebitRequestDto,
} from "../../../../../src/presentation/dtos/debit.dto";

import { TRANSACTION_TYPE } from "../../../../../src/infrastructure/database/generated/enums";
import { Decimal } from "@prisma/client/runtime/client";
import { UnauthorizedException } from "@nestjs/common";

import { mockKafkaProducer } from "../../../../__mocks__/kafka.mock";
import { KAFKA_TOPICS } from "../../../../../src/constants/kafka";

const { mockTransactionRepository } = vi.hoisted(() => ({
  mockTransactionRepository: {
    debitTransaction: vi.fn<() => Promise<DebitResponseDto>>(),
  },
}));

const makeSutParams = (): DebitRequestDto => ({
  transactionId: "txn-123e4567-e89b-12d3-a456-426614174002",
  playerId: "1b076f67-f730-4c37-bd26-f2ca34bd1d4f",
  walletId: "9927efd0-1e14-421d-8112-c4be3419d5eb",
  transactionValue: new Decimal(100),
});

const makeResponse = (): DebitResponseDto => ({
  transactionId: "txn-123e4567-e89b-12d3-a456-426614174002",
  walletId: "9927efd0-1e14-421d-8112-c4be3419d5eb",
  playerId: "1b076f67-f730-4c37-bd26-f2ca34bd1d4f",
  transactionValue: new Decimal(500),
  currentBalance: new Decimal(400),
  type: TRANSACTION_TYPE.DEBIT,
  createdAt: new Date("2026-03-27T18:34:20.615Z"),
});

describe("DebitService", () => {
  let sut: DebitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebitService,
        {
          provide: TransactionRepositoryContract,
          useValue: mockTransactionRepository,
        },
        {
          provide: "wallets-producer",
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();
    sut = module.get<DebitService>(DebitService);
  });

  describe("SUT", () => {
    it("should be defined", () => {
      expect(sut).toBeDefined();
    });
  });

  describe("Debit Service", () => {
    const params = makeSutParams();
    const response = makeResponse();

    describe("Happy-Path", () => {
      it("should call repository and return transaction", async () => {
        mockTransactionRepository.debitTransaction.mockResolvedValue(response);

        const result = await sut.execute(params);

        expect(result).toEqual(response);
        expect(mockTransactionRepository.debitTransaction).toHaveBeenCalledWith(
          {
            playerId: params.playerId,
            transactionId: params.transactionId,
            walletId: params.walletId,
            transactionValue: params.transactionValue,
          },
        );
      });

      it("should emit kafka event with correct payload", async () => {
        mockTransactionRepository.debitTransaction.mockResolvedValue(response);

        await sut.execute(params);

        expect(mockKafkaProducer.emit).toHaveBeenCalledWith(
          KAFKA_TOPICS.DEBIT_TRANSACTION,
          {
            transaction: params.transactionId,
            wallet: params.walletId,
            player: params.playerId,
            debited_value: params.transactionValue,
          },
        );
      });
    });

    describe("Errors", () => {
      it("should throw UnauthorizedException() when walletId is not provided", async () => {
        mockTransactionRepository.debitTransaction.mockRejectedValue(
          new UnauthorizedException("Not allowed to complete the transaction!"),
        );

        await expect(
          sut.execute({
            transactionId: "txn-123e4567-e89b-12d3-a456-426614174002",
            playerId: "1b076f67-f730-4c37-bd26-f2ca34bd1d4f",
            walletId: "",
            transactionValue: new Decimal(100),
          }),
        ).rejects.toThrow(
          new UnauthorizedException("Not allowed to complete the transaction!"),
        );
      });

      it("should throw UnauthorizedException() when playerId is not equal to playerId from request", async () => {
        const InvalidParams = {
          ...params,
          playerId: "id-invalido",
        };

        mockTransactionRepository.debitTransaction.mockRejectedValue(
          new UnauthorizedException("Not allowed to complete the transaction!"),
        );

        await expect(sut.execute(InvalidParams)).rejects.toThrow(
          new UnauthorizedException("Not allowed to complete the transaction!"),
        );
      });

      it("should throw UnauthorizedException() when balance is insufficient", async () => {
        const InvalidParams = {
          ...params,
          transactionValue: new Decimal(100),
          currentBalance: new Decimal(40),
        };

        mockTransactionRepository.debitTransaction.mockRejectedValue(
          new UnauthorizedException(
            "Not allowed to complete the transaction! The balance is insufficient!",
          ),
        );

        await expect(sut.execute(InvalidParams)).rejects.toThrow(
          new UnauthorizedException(
            "Not allowed to complete the transaction! The balance is insufficient!",
          ),
        );
      });

      it("should throw UnauthorizedException() when balance is negative", async () => {
        const InvalidParams = {
          ...params,
          transactionValue: new Decimal(100),
          currentBalance: new Decimal(0),
        };

        mockTransactionRepository.debitTransaction.mockRejectedValue(
          new UnauthorizedException(
            "Not allowed to complete the transaction! The balance is negative!",
          ),
        );

        await expect(sut.execute(InvalidParams)).rejects.toThrow(
          new UnauthorizedException(
            "Not allowed to complete the transaction! The balance is negative!",
          ),
        );
      });
    });
  });
});
