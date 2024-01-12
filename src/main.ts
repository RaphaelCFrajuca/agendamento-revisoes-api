import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: false },
            forbidNonWhitelisted: true,
        }),
    );
    const options = new DocumentBuilder()
        .setTitle("Agendamento de Revisões")
        .setDescription("API REST para Agendamento de Revisões em Oficina de Carros")
        .setVersion("1.0")
        .addBearerAuth({
            type: "http",
            description: "Bearer token do administrador",
            name: "Authorization",
        })
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("docs", app, document);
    await app.listen(8080);
}
bootstrap();
