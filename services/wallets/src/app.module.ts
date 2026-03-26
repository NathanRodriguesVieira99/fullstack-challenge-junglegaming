import { ClientsModule, Transport } from "@nestjs/microservices";

import { Module } from "@nestjs/common";

import { DatabaseModule } from "@db/database.module";

import { AuthModule } from "./infrastructure/auth/auth.module";

import { httpModule } from "./presentation/http.module";

@Module({
  imports: [
    httpModule,
    AuthModule,
    DatabaseModule,
    /* usado para transformar o service em producer */
    ClientsModule.register([
      {
        name: "wallets-producer",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["kafka:29092"], // fora do Docker => localhost:9092
          },
        },
      },
    ]),
  ],
})
export class AppModule {}
