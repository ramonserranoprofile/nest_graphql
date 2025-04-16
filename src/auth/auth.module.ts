import { forwardRef, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
//import { OAuthController } from './infrastructure/controllers/oauth.controller';
import { AuthService } from './domain/services/auth.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { AuthSession } from './domain/entities/auth-session.entity';
import { OAuthStrategy } from './infrastructure/strategies/oauth2.strategy';
import { AuthResolver } from './presentation/resolvers/auth.resolver';
import { SessionCleanupService } from './domain/services/session-cleanup.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { TokenMiddleware } from './infrastructure/middleware/token.middleware';


@Module({
  imports: [
    TypeOrmModule.forFeature([AuthSession]), // Añade esto
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => ({
      secret: config.get('JWT_SECRET'),
      signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
    }),
    inject: [ConfigService],
    }),
  ],
  providers: [
    SessionCleanupService,
    AuthService,
    AuthResolver,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Guard global
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthResolver],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        'auth/login',
        'auth/register',
        //'api/docs',
        //'api/redoc',
        'api/graphql',
        'api',
        'api-doc/graphql'        
      )
      .forRoutes('*');
  }
}