import { Test, TestingModule } from "@nestjs/testing";
import { CreditController } from "../../../../../src/presentation/controllers/transactions/credit.controller";

describe("CreditController", () => {
  let controller: CreditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditController],
    }).compile();

    controller = module.get<CreditController>(CreditController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
