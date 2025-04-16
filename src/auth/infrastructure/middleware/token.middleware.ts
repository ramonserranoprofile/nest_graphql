// src/auth/infrastructure/middleware/token.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Excluye rutas públicas
    const publicRoutes = ['/auth/login', '/auth/register', '/api/docs', '/api/redoc'];
    if (publicRoutes.some(route => req.path.startsWith(route))) {
      return next();
    }

    // Verifica el header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Formato de token inválido. Use: Bearer <token>');
    }

    const token = authHeader.split(' ')[1];
    try {
      // Verifica y decodifica el token
      const payload = this.jwtService.verify(token);
      req.user = payload; // Adjunta el usuario al request
      next();
    } catch (e) {
      // Manejo específico de errores
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}