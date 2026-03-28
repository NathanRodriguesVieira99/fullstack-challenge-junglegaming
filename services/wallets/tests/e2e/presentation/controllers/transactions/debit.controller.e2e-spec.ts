import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/app.module";
import { mockKafkaProducer } from "../../../../__mocks__/kafka.mock";

describe.skip("CreditController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider("wallets-producer")
      .useValue(mockKafkaProducer)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe.skip("", () => {
    describe("Happy-Path", () => {});
  });
});
