import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { httpModule } from "./presentation/http.module";

@Module({
  imports: [httpModule, AuthModule, DatabaseModule],
})
export class AppModule {}
