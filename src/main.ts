import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import { TokenMiddleware } from './auth/infrastructure/middleware/token.middleware';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  logger: console,
}); // 👈 Asegura el tipo correcto

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('Documentación de la API de Nest.js con Swagger: Incluye endpoints REST y GraphQL')
    .setVersion('1.0')    
    .addBearerAuth( // 👈 Configuración clave para Swagger
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingresa el token JWT',
      in: 'header',
    },
    'JWT-auth', // Este nombre debe coincidir con el usado en @ApiBearerAuth()
    )
    //.addOAuth2() // Habilita OAuth2 en Swagger
    .addTag('Nest.js BackEnd API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configurar ReDoc
  const redocOptions: RedocOptions = {
    title: 'Documentación de la API',    
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,

  };

  await RedocModule.setup('api/redoc', app as any, document, redocOptions); // 👈 Agregar `as any` como workaround
  
  const jwtService = new JwtService({});
  
  // app.useLogger(app.get(Logger));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
