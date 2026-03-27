import { describe, it, beforeEach, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { CreditService } from "../../../../../src/application/services/transactions/credit.service";

describe("CreditService", () => {
  let service: CreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditService],
    }).compile();

    service = module.get<CreditService>(CreditService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
