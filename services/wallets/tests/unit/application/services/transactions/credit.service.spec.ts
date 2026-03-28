import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, beforeEach, expect, vi } from "vitest";

import { CreditService } from "../../../../../src/application/services/transactions/credit.service";
import {
  CreditRequestDto,
  CreditResponseDto,
} from "../../../../../src/presentation/dtos/credit.dto";

import { TransactionRepositoryContract } from "../../../../../src/domain/repositories/transactions/transactions.repository.contract";

import { mockKafkaProducer } from "../../../../__mocks__/kafka.mock";
import {
  KAFKA_TOPICS,
  KAFKA_CLIENTS,
} from "../../../../../src/constants/kafka";

import { TRANSACTION_TYPE } from "../../../../../src/infrastructure/database/generated/enums";
import { Decimal } from "@prisma/client/runtime/client";
import { UnauthorizedException } from "@nestjs/common";

const { mockTransactionRepository } = vi.hoisted(() => ({
  mockTransactionRepository: {
    creditTransaction: vi.fn(),
  },
}));

const makeParams = (): CreditRequestDto => ({
  transactionValue: new Decimal(100),
  playerId: "1b076f67-f730-4c37-bd26-f2ca34bd1d4f",
  transactionId: "txn-123e4567-e89b-12d3-a456-426614174002",
  walletId: "9927efd0-1e14-421d-8112-c4be3419d5eb",
});

const makeResponse = (): CreditResponseDto => ({
  transactionId: "txn-123e4567-e89b-12d3-a456-426614174002",
  playerId: "1b076f67-f730-4c37-bd26-f2ca34bd1d4f",
  walletId: "9927efd0-1e14-421d-8112-c4be3419d5eb",
  type: TRANSACTION_TYPE.CREDIT,
  transactionValue: new Decimal(500),
  currentBalance: new Decimal(400),
  createdAt: new Date("2026-03-27T18:34:20.615Z"),
});

describe("CreditService", () => {
  let sut: CreditService;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditService,
        {
          provide: TransactionRepositoryContract,
          useValue: mockTransactionRepository,
        },
        {
          provide: KAFKA_CLIENTS.PRODUCER,
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();
    sut = module.get<CreditService>(CreditService);
  });

  it("should be defined", () => {
    expect(sut).toBeDefined();
  });

  describe("Credit Service", () => {
    const params = makeParams();
    const response = makeResponse();

    describe("Happy-Path", () => {
      it("should call repository and return transaction", async () => {
        mockTransactionRepository.creditTransaction.mockResolvedValue(response);

        const result = await sut.execute(params);

        expect(result).toEqual(response);
        expect(
          mockTransactionRepository.creditTransaction,
        ).toHaveBeenCalledWith({
          playerId: params.playerId,
          transactionId: params.transactionId,
          walletId: params.walletId,
          transactionValue: params.transactionValue,
        });
      });

      it("should emit kafka event with correct payload", async () => {
        mockTransactionRepository.creditTransaction.mockResolvedValue(response);

        await sut.execute(params);

        expect(mockKafkaProducer.emit).toHaveBeenCalledWith(
          KAFKA_TOPICS.CREDIT_TRANSACTION,
          {
            transaction: params.transactionId,
            wallet: params.walletId,
            player: params.playerId,
            credited_value: params.transactionValue,
          },
        );
      });

      it("should NOT call repository when validation fails", async () => {
        const fakeParams = { ...params, walletId: "" };

        await expect(sut.execute(fakeParams)).rejects.toThrow(
          "Not allowed to complete the transaction!",
        );
        expect(
          mockTransactionRepository.creditTransaction,
        ).not.toHaveBeenCalled();
      });

      it("should NOT emit kafka when validation fails", async () => {
        const fakeParams = { ...params, walletId: "" };

        await expect(sut.execute(fakeParams)).rejects.toThrow(
          "Not allowed to complete the transaction!",
        );
        expect(mockKafkaProducer.emit).not.toHaveBeenCalled();
      });
    });

    describe("Errors - Validation in Service", () => {
      it("should throw UnauthorizedException when walletId is empty", async () => {
        const fakeParams = { ...params, walletId: "" };

        await expect(sut.execute(fakeParams)).rejects.toThrow(
          UnauthorizedException,
        );
        await expect(sut.execute(fakeParams)).rejects.toThrow(
          "Not allowed to complete the transaction!",
        );
      });

      it("should throw UnauthorizedException when playerId is empty", async () => {
        const fakeParams = { ...params, playerId: "" };

        await expect(sut.execute(fakeParams)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it("should throw UnauthorizedException when transactionValue is less than 1", async () => {
        const fakeParams = { ...params, transactionValue: new Decimal(0) };

        await expect(sut.execute(fakeParams)).rejects.toThrow(
          UnauthorizedException,
        );
        await expect(sut.execute(fakeParams)).rejects.toThrow(
          "The minimal value to bet is 1.00",
        );
      });

      it("should throw UnauthorizedException when transactionValue is greater than 1000", async () => {
        const fakeParams = { ...params, transactionValue: new Decimal(1001) };

        await expect(sut.execute(fakeParams)).rejects.toThrow(
          UnauthorizedException,
        );
        await expect(sut.execute(fakeParams)).rejects.toThrow(
          "The max value to bet is 1000.00",
        );
      });
    });
  });
});
