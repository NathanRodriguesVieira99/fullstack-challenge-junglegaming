import { describe, it, beforeEach, expect, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { CreditService } from "../../../../../src/application/services/transactions/credit.service";
import { TransactionRepositoryContract } from "../../../../../src/domain/repositories/transactions/transactions.repository.contract";
import { KAFKA_CLIENTS } from "../../../../../src/constants/kafka";

const { mockTransactionRepository, mockKafkaProducer } = vi.hoisted(() => ({
  mockTransactionRepository: {
    creditTransaction: vi.fn(),
  },
  mockKafkaProducer: {
    emit: vi.fn(),
  },
}));

describe("CreditService", () => {
  let service: CreditService;

  beforeEach(async () => {
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

    service = module.get<CreditService>(CreditService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
