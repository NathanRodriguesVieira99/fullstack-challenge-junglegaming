import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./_config/env";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  /* usado para transformar o service em consumer */
  app.connectMicroservice({
    options: {
      client: {
        brokers: ["kafka:29092"], // fora do Docker => localhost:9092
      },
      consumer: {
        groupId: "games-consumer",
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(env.PORT);

  console.log(`Games service running on port ${env.PORT}`);
}

bootstrap();
