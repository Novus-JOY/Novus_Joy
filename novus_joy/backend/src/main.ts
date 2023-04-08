import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  //서버의 static파일을 제공하기위한 미들웨어 , <NestExpressApplication>제네릭을 사용해 express app이란 걸 알려줘야 useStaticAssets메서드 사용가능
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/media',
  });

  const config = new DocumentBuilder()
    .setTitle('novus')
    .setDescription('The novus API description')
    .setVersion('1.0')
    // .addTag('novus1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    ['/apis', 'apis-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  SwaggerModule.setup('apis', app, document);

  app.enableCors({
    origin: true, //특정url권장
    credentials: true,
  });
  await app.listen(8000);
}

bootstrap();
