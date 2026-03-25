import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { MicroserviceOptions } from "@nestjs/microservices";
import { env, Swagger } from "./_config";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  /* usado para transformar o service em consumer */
  app.connectMicroservice<MicroserviceOptions>({
    options: {
      client: {
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

  console.log(`Wallets service running on port ${env.PORT}`);
}

bootstrap();
