// src/auth/presentation/resolvers/auth.resolver.ts

import { Mutation, Resolver, Args, Context } from '@nestjs/graphql';
import { AuthService } from '../../domain/services/auth.service';
import { LoginInput, AuthPayload, RegisterInput } from '../../application/dtos/auth.input';
import { Query } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { User } from '../../../user/domain/entities/user.entity';
import { Public } from 'src/shared/decorators/public.decorator';

@Resolver(() => AuthPayload)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    const result = await this.authService.register(input);
    return {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      access_token: result.access_token,    
      refresh_token: result.refresh_token,
      expires_in: '1h'
    };
  };
  @Public()
  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const user = await this.authService.validateUser(input.email, input.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

        // Usamos el mismo método login del AuthService
    const loginResult = await this.authService.login(user);
    
    return {
        id: loginResult.id,
        email: loginResult.email,
        name: loginResult.name,
        access_token: loginResult.access_token,
        refresh_token: loginResult.refresh_token,
        expires_in: loginResult.expires_in
    };
}

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context) {
    const token = context.req.headers.authorization.split(' ')[1];
    await this.authService.logout(token);
    return 'Sesión cerrada exitosamente';
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}