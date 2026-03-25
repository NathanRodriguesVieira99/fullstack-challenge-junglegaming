import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import { Logger, type INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const Swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("Service de Wallets")
    .setDescription("Documentação referente ao serviço de Wallet")
    .setVersion("0.0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("wallets-docs", app, document);

  if (process.env.NODE_ENV === "development") {
    const specFile = resolve(__dirname, "../../../swagger.json");

    const spec = JSON.stringify(document, null, 2);

    writeFile(specFile, spec).then(() => {
      Logger.log(
        "[Wallets] - Swagger spec generated! Docs available on http://localhost:4002/wallets-docs",
      );
    });
  }
};
