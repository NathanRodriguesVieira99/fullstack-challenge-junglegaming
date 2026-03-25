import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env, Swagger } from "./_config";
import type { MicroserviceOptions } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  /* usado para transformar o service em consumer */
  app.connectMicroservice<MicroserviceOptions>({
    options: {
      client: {
        brokers: ["kafka:29092"], // fora do Docker => localhost:9092
      },
      consumer: {
        groupId: "games-consumer",
      },
    },
  });

  Swagger(app);
  await app.startAllMicroservices();
  await app.listen(env.PORT);

  Logger.log(`Games service running on http://localhost:${env.PORT}`);
}

bootstrap();
