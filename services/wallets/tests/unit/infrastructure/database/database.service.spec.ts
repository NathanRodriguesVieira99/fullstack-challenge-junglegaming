import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { DatabaseService } from "../../../../src/infrastructure/database/database.service";

const mockPrisma = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  onModuleInit: vi.fn(),
  onModuleDestroy: vi.fn(),
};

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => mockPrisma),
}));

describe("DatabaseService", () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        {
          provide: DatabaseService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call $connect", async () => {
    mockPrisma.onModuleInit.mockImplementation(() => {
      mockPrisma.$connect();
    });

    await service.onModuleInit();

    expect(service.$connect).toHaveBeenCalledTimes(1);
  });

  it("should call $disconnect", async () => {
    mockPrisma.onModuleDestroy.mockImplementation(() => {
      mockPrisma.$disconnect();
    });

    await service.onModuleDestroy();

    expect(service.$disconnect).toHaveBeenCalledTimes(1);
  });
});
