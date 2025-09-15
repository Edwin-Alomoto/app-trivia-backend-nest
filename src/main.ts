import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envs } from './shared/config/envs';

async function bootstrap() {
  const logger = new Logger('Main-Auth-Microservice');

  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  const allowedOrigins = envs.allowedOrigins
    ? envs.allowedOrigins.split(',').map((origin) => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4200',
      ];

  // En producción, permitir todos los orígenes si no se especifican
  const corsOrigin =
    envs.nodeEnv === 'production' && !envs.allowedOrigins
      ? true
      : allowedOrigins;

  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Bearer',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Habilita la transformación automática
      transformOptions: {
        enableImplicitConversion: true, // Permite conversiones implícitas
      },
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("Nanny's Backend API")
    .setDescription("API documentation for Nanny's Backend application")
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Trivia-App running on port ${envs.port}`);
  logger.log(
    `Swagger documentation available at: http://localhost:${envs.port}/api/docs`,
  );
}

bootstrap();
