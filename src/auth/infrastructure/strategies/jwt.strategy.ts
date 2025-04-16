// src/auth/infrastructure/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('Payload recibido:', payload); // 👈 Verifica qué contiene realmente
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token inválido: faltan campos requeridos');
    }
    return { 
      id: payload.sub,
      email: payload.email,
      name: payload.name || null // Maneja casos donde name no esté en el token
    };
  }
}