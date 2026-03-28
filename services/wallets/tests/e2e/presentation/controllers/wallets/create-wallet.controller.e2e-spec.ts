import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { describe, beforeAll, it, expect, afterAll } from "vitest";
import { CLIENT_ID, KEYCLOAK_URL, REALM } from "../../../shared/constants";

import request from "supertest";

import { AppModule } from "../../../../../src/app.module";
import { DatabaseService } from "../../../../../src/infrastructure/database/database.service";
import { mockKafkaProducer } from "../../../../__mocks__/kafka.mock";

describe("CreateWalletController E2E", () => {
  let app: INestApplication;
  let accessToken: string;
  let db: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider("wallets-producer")
      .useValue(mockKafkaProducer)
      .compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get<DatabaseService>(DatabaseService);

    await app.init();
  });

  beforeEach(async () => {
    const tokenResponse = await request(KEYCLOAK_URL)
      .post(`/realms/${REALM}/protocol/openid-connect/token`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(
        `grant_type=password&client_id=${CLIENT_ID}&username=player&password=player123&scope=openid`,
      );

    accessToken = tokenResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /wallets", () => {
    describe("Happy Path", () => {
      it("should create wallet with default balance when valid token provided", async () => {
        const response = await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("playerId");
        expect(response.body).toHaveProperty("balance");
        expect(response.body.balance).toBe("1000");
      });
    });

    describe("Errors", () => {
      it("should return 401 when no token provided", async () => {
        const response = await request(app.getHttpServer()).post("/wallets");
        expect(response.status).toBe(401);
      });

      it("should return 401 when token is invalid", async () => {
        const response = await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(401);
      });

      it("should return 409 when wallet already exists", async () => {
        await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", `Bearer ${accessToken}`);

        const response = await request(app.getHttpServer())
          .post("/wallets")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Wallet already exists");
      });
    });
  });
});
