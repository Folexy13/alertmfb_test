import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './shared/exceptions';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as path from 'path'
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(path.join(__dirname, '..', 'templates')); // Set templates folder
  app.setViewEngine('hbs'); // Set Handlebars as the view engine

  // Enable the global validation pipe
  app.useGlobalPipes(new ValidationPipe());



  // Apply the filter globally
  app.useGlobalFilters(new ExceptionsFilter());
  const config = new DocumentBuilder()
    .setTitle('AlertMFB API')
    .setDescription('AlertMFB API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
