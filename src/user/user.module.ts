// src/user/user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { IUserRepository } from '../user/domain/interfaces/IUserRepository';
import { UserService } from '../user/domain/services/user.service';
import { AuthModule } from '../auth/auth.module'; // Asegúrate de que la ruta sea correcta
import { UserRepository } from './infrastructure/database/repositories/UserRepository';
import { UserResolver } from './presentation/resolvers/user.resolver';


@Module({
  // imports: [
  //   TypeOrmModule.forFeature([User]),
  //   forwardRef(() => AuthModule), // Importa AuthModule si necesitas usar servicios de autenticación
  // ],
  // providers: [
  //   UserService,
  //   UserResolver,
  //   {
  //     provide: 'IUserRepository',
  //     useClass: UserRepository,
  //   }
  // ],
  // exports: [UserService, TypeOrmModule, 'IUserRepository'], // Exporta TypeOrmModule para que otros módulos puedan usar las entidades
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    UserResolver,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    }
  ],
  exports: [UserService, 'IUserRepository', TypeOrmModule],
})
export class UserModule {}