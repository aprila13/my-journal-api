import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formatted = errors.map((e) => ({
          field: e.property,
          constraints: e.constraints,
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formatted,
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('My Journal')
    .setDescription('My Journal APIs')
    .setVersion('1.0')
    .addCookieAuth('Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
