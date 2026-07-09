import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades não declaradas nos DTOs
      forbidNonWhitelisted: true, // rejeita requisições com campos extras
      transform: true, // converte tipos automaticamente (ex.: string -> number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
