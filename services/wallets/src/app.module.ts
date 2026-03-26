import { Module } from "@nestjs/common";
import { DatabaseModule } from "@db/database.module";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { httpModule } from "./presentation/http.module";

@Module({
  imports: [httpModule, AuthModule, DatabaseModule],
})
export class AppModule {}
