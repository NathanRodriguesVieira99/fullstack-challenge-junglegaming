import { Global, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { env } from "@/_config";
import { JwtStrategyService } from "./jwt/jwt-strategy.service";

@Global()
@Module({
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        publicKey: env.JWT_SECRET,
      }),
    }),
  ],
  providers: [JwtStrategyService],
  controllers: [],
})
export class AuthModule {}
