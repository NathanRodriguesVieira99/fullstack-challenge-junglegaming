import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { describe, beforeAll, beforeEach, it, expect, afterAll } from "vitest";

import request from "supertest";

import { AppModule } from "../../../../../src/app.module";
import { DatabaseService } from "../../../../../src/infrastructure/database/database.service";

import { MockJwtGuard } from "../../../../__mocks__/jwt.guard.mock";
import { JwtGuard } from "../../../../../src/infrastructure/auth/jwt/jwt.guard";

describe("[E2E] CreateWalletController", () => {
  let app: INestApplication;
  let db: DatabaseService;

  const MOCK_TOKEN = "mock-jwt-token";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useClass(MockJwtGuard)
      .compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get<DatabaseService>(DatabaseService);

    await app.init();
  });

  beforeEach(async () => {
    await db.wallet.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /wallets", () => {
    describe("Happy Path", () => {
      it("should create wallet with default balance when valid token provided", async () => {
        const response = await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", `Bearer ${MOCK_TOKEN}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("playerId");
        expect(response.body).toHaveProperty("balance");
        expect(response.body.balance).toBe("1000");
      });
    });

    describe("Errors", () => {
      it("should return 401 when no token provided", async () => {
        const response = await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", `Bearer `);
        expect(response.status).toBe(401);
      });

      it("should return 401 when token is invalid", async () => {
        const response = await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", "Bearer ");

        expect(response.status).toBe(401);
      });

      it("should return 409 when wallet already exists", async () => {
        await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", `Bearer ${MOCK_TOKEN}`);

        const response = await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", `Bearer ${MOCK_TOKEN}`);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Wallet already exists");
      });
    });
  });
});
