import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";

import { describe, it, expect, afterAll, beforeAll, beforeEach } from "vitest";

import { AppModule } from "../../../../../src/app.module";

import { DatabaseService } from "../../../../../src/infrastructure/database/database.service";

import request from "supertest";

import { JwtGuard } from "../../../../../src/infrastructure/auth/jwt/jwt.guard";
import { MockJwtGuard } from "../../../../__mocks__/jwt.guard.mock";

describe("[E2E] GetWallet Controller ", () => {
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

    await request(app.getHttpServer())
      .post("/wallets")
      .set("Authorization", `Bearer ${MOCK_TOKEN}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /wallets/me", () => {
    describe("Happy-Paths", () => {
      it("should return wallet when authenticated and wallet exists", async () => {
        const response = await request(app.getHttpServer())
          .get("/wallets/me")
          .set("Authorization", `Bearer ${MOCK_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("playerId");
        expect(response.body).toHaveProperty("balance");
      });

      it("should return wallet with sanitized bigint balance as string", async () => {
        const response = await request(app.getHttpServer())
          .get("/wallets/me")
          .set("Authorization", `Bearer ${MOCK_TOKEN}`);

        expect(response.status).toBe(200);
        expect(typeof response.body.balance).toBe("string");
      });
    });

    describe("Errors", () => {
      it("should return 401 when no token provided", async () => {
        const response = await request(app.getHttpServer()).get("/wallets/me");
        expect(response.status).toBe(401);
      });

      it("should return 401 when token is invalid", async () => {
        const response = await request(app.getHttpServer())
          .get("/wallets/me")
          .set("Authorization", "Bearer ");

        expect(response.status).toBe(401);
      });
    });
  });
});
