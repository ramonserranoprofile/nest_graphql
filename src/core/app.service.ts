// src/core/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {"message": "¡Bienvenido a la API!"};
  }
}