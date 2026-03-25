import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect } from "vitest";
import { AuthController } from "../../../../src/infrastructure/auth/auth.controller";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
