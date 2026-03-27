import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwksRsa from "jwks-rsa";

interface Payload {
  sub: string;
  preferred_username: string;
}

const KEYCLOAK_URL =
  process.env.KEYCLOAK_URL || "http://host.docker.internal:8080";

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${KEYCLOAK_URL}/realms/crash-game/protocol/openid-connect/certs`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ["RS256"],
    });
  }

  // objeto gerado => req.user.*
  async validate(payload: Payload) {
    return {
      userId: payload.sub,
      username: payload.preferred_username,
    };
  }
}
