import "reflect-metadata";
import { Transport, type MicroserviceOptions } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";

import { AppModule } from "./app.module";

import { env, Swagger } from "./_config";

import {
  KAFKA_BROKER,
  KAFKA_CLIENTS,
  KAFKA_CLIENTS_IDS,
  KAFKA_GROUPS,
} from "./constants/kafka";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      name: KAFKA_CLIENTS.PRODUCER,
      client: {
        clientId: KAFKA_CLIENTS_IDS.KAFKA_CONSUMER_CLIENT_ID,
        brokers: [KAFKA_BROKER],
      },
      consumer: {
        groupId: KAFKA_GROUPS.KAFKA_CONSUMER_GROUP,
      },
    },
  });

  Swagger(app);
  await app.startAllMicroservices();
  await app.listen(env.PORT);

  Logger.log(`Wallets service running on http://localhost:${env.PORT}`);
}

bootstrap();
