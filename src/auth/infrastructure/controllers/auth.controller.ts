// src/auth/infrastructure/controllers/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req, Inject, SetMetadata, UnauthorizedException, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { LoginResponseDto } from '../../application/dtos/login-response.dto';
import { OAuthStrategy } from '../strategies/oauth2.strategy';
import { Public } from '../../../shared/decorators/public.decorator';
import { User } from '../../../user/domain/entities/user.entity';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayload } from 'src/auth/application/dtos/auth.input';
import { RegisterDto } from 'src/auth/application/dtos/register.dto';
import { ID } from '@nestjs/graphql';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService, // Debe coincidir con el proveedor
    private readonly jwtService: JwtService
  ) {}
  
@Public()
@Post('login')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Iniciar sesión' })
@ApiBody({ type: LoginDto })
@ApiResponse({ 
  status: 200, 
  description: 'Token JWT generado',
})
@ApiResponse({ 
  status: 401, 
  description: 'Credenciales inválidas' 
})
async login(@Body() dto: LoginDto) {
  this.logger.log('Petición de login recibida');
  const user = await this.authService.validateUser(dto.email, dto.password);
  
  if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Usamos el método unificado login del AuthService
  const loginResult = await this.authService.login(user);
  
  return {
    access_token: loginResult.access_token,
    refresh_token: loginResult.refresh_token,
    expires_in: loginResult.expires_in,
    user_id: loginResult.id,
    // user: {
    //   id: loginResult.id,
    //   email: loginResult.email,
    //   name: loginResult.name
    // }
  };
}
  
  
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado', type: AuthPayload })
  @ApiResponse({ status: 400, description: 'Datos inválidos' }) 
  async register(@Body() dto: RegisterDto) {
    const user: User = {
      ...dto,
      id: dto.id, // Assign default or generate an ID if necessary
      name: dto.name, // Provide a default or map from dto if available
      sessions: [],
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      // expiresAt: dto.expiresdAt
    };
    return this.authService.register(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // 👈 Usa AuthGuard('jwt') en lugar de JwtStrategy directamente
  @ApiBearerAuth('JWT-auth')   // 👈 Mismo nombre que en addBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async logout(@Req() req) {
    console.log('Token recibido:', req.headers.authorization); // Debug
    console.log('Usuario autenticado:', req.user); // Verifica el payload
    // Verificación segura del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

  const token = authHeader.split(' ')[1];
  await this.authService.logout(token);
  return { message: 'Sesión cerrada exitosamente' };
}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('oauth2'))  
  @ApiOperation({ summary: 'Autenticación con Google' })
  @ApiResponse({ status: 302, description: 'Redirección a Google para autenticación' })
  async googleAuth(@Req() req) {
    // No es necesario implementar nada aquí, Passport manejará la redirección
  }
  
  @Public()
  @Get('google/callback')
  @UseGuards(OAuthStrategy)
  @ApiOperation({ summary: 'Callback de autenticación con Google' })
  @ApiResponse({ status: 200, description: 'Autenticación exitosa', type: AuthPayload })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async googleAuthCallback(@Req() req) {
    const result = await this.authService.handleOAuthLogin(req.user);
    return {
      access_token: result.access_token,
      expires_in: result.expires_in,
    };
  }
  async googleAuthRedirect(@Req() req): Promise<{ access_token: string; expires_in: string; }> {
    const result = await this.authService.handleOAuthLogin(req.user);
    return {
      access_token: result.access_token,
      expires_in: result.expires_in,
    };
  }
  
  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // 👈 Usa AuthGuard('jwt') en lugar de JwtStrategy directamente
  @ApiBearerAuth('JWT-auth')   // 👈 Mismo nombre que en addBearerAuth()
  getProfile(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('No autenticado');
    }
    return { user: req.user };
  }
  
  @Public()
  @Get('oauth/callback')
  @UseGuards(OAuthStrategy)
  async oauthCallback(@Req() req): Promise<{ access_token: { access_token: string; expires_in: string; }; }> {
    const token = await this.authService.handleOAuthLogin(req.user);
    return { access_token: { access_token: token.access_token, expires_in: token.expires_in } };
  }
}
