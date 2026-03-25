import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import { Logger, type INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const Swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("Service de Games")
    .setDescription("Documentação referente ao serviço de Games")
    .setVersion("0.0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("games-docs", app, document);

  if (process.env.NODE_ENV === "development") {
    const specFile = resolve(__dirname, "../../../swagger.json");
    const spec = JSON.stringify(document, null, 2);

    writeFile(specFile, spec).then(() => {
      Logger.log(
        "[Games] - Swagger spec generated! Docs available on http://localhost:4001/games-docs",
      );
    });
  }
};
