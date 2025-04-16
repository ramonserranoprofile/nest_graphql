// src/core/app.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiConsumes,
  ApiProduces 
} from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiBearerAuth('JWT-auth') // Opcional: Si usas autenticación JWT
@ApiTags('Core API') // Agrupa endpoints en Swagger UI
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Endpoint de bienvenida',
    description: 'Retorna un mensaje de bienvenida de la API'
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de bienvenida obtenido correctamente',
    schema: {
      type: 'object',
      example: {'message':'¡Bienvenido a la API!'}
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor'
  })
  getHello(): object {
    return this.appService.getHello();
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Procesar datos de ejemplo',
    description: 'Recibe un payload y registra en consola'
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({
    description: 'Ejemplo de payload',
    schema: {
      type: 'object',
      example: {}
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Datos recibidos correctamente',
    schema: {
      type: 'object',
      example: {"message":"¡Bienvenido a la API!"}
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Payload inválido'
  })
  postHello(@Body() body: any): any {
    console.log('Body Request:', body);
    return this.appService.getHello();
  }
}