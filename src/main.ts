import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 👈 Asegura el tipo correcto

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('Documentación de la API de Nest.js con Swagger')
    .setVersion('1.0')
    .addTag('Nest.js BackEnd API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Configurar ReDoc
  const redocOptions: RedocOptions = {
    title: 'Documentación de la API',
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
  };

  await RedocModule.setup('redoc', app as any, document, redocOptions); // 👈 Agregar `as any` como workaround

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
