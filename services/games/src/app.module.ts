import { ClientsModule, Transport } from "@nestjs/microservices";
import { Module } from "@nestjs/common";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { DatabaseModule } from "@db/database.module";
import { GameGateway } from "@gateways/websockets.gateway";
import { httpModule } from "./presentation/http.module";

@Module({
  imports: [
    httpModule,
    DatabaseModule,
    AuthModule,
    /* usado para transformar o service em producer */
    ClientsModule.register([
      {
        name: "games-producer",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["kafka:29092"], // fora do Docker => localhost:9092
          },
        },
      },
    ]),
  ],
  providers: [GameGateway],
})
export class AppModule {}
