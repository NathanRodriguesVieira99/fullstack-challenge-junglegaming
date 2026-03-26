import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { MicroserviceOptions } from "@nestjs/microservices";
import { env, Swagger } from "./_config";
import { Logger } from "@nestjs/common";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  /* usado para transformar o service em consumer */
  app.connectMicroservice<MicroserviceOptions>({
    options: {
      name: "wallets-consumer",
      client: {
        clientId: "WALLETS_SERVICE_CONSUMER",
        brokers: ["kafka:29092"], // fora do Docker => localhost:9092
      },
      consumer: {
        groupId: "wallets-consumer",
      },
    },
  });

  Swagger(app);
  await app.startAllMicroservices();
  await app.listen(env.PORT);

  Logger.log(`Wallets service running on http://localhost:${env.PORT}`);
}

bootstrap();
