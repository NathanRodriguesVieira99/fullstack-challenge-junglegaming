import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect } from "vitest";
import { CreateWalletsService } from "../../../../../src/application/services/wallets/create-wallets.service";

describe("CreateWalletsService", () => {
  let service: CreateWalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateWalletsService],
    }).compile();

    service = module.get<CreateWalletsService>(CreateWalletsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
