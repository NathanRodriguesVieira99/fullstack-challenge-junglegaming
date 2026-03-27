import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";

import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { CLIENT_ID, KEYCLOAK_URL, REALM } from "../../../shared/constants";

import request from "supertest";

import { AppModule } from "../../../../../src/app.module";
import { DatabaseService } from "../../../../../src/infrastructure/database/database.service";

describe("[E2E] GetWallet Controller ", () => {
  let app: INestApplication;
  let accessToken: string;
  let db: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

    await request(app.getHttpServer())
      .post("/wallets")
      .set("Authorization", `Bearer ${accessToken}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /wallets/me", () => {
    describe("Happy-Paths", () => {
      it("should return wallet when authenticated and wallet exists", async () => {
        const response = await request(app.getHttpServer())
          .get("/wallets/me")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("playerId");
        expect(response.body).toHaveProperty("balance");
      });

      it("should return wallet with sanitized bigint balance as string", async () => {
        const response = await request(app.getHttpServer())
          .get("/wallets/me")
          .set("Authorization", `Bearer ${accessToken}`);

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
          .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(401);
      });
    });
  });
});
