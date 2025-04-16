// src/core/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../shared/database/config/typeorm.config';
import { AppController } from './app.controller';
import { GraphQLDocsController } from './graphql-docs.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AuthResolver } from 'src/auth/presentation/resolvers/auth.resolver';
import { UserResolver } from 'src/user/presentation/resolvers/user.resolver';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AuthController } from 'src/auth/infrastructure/controllers/auth.controller';
import { AuthService } from 'src/auth/domain/services/auth.service';
import { JwtService } from '@nestjs/jwt';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ 
//       isGlobal: true,
//       envFilePath: '.env', // Asegura que carga las variables correctamente
//     }),
//     TypeOrmModule.forRoot({
//       ...typeOrmConfig, // Asegúrate de que esta configuración es completa
//       autoLoadEntities: true, // Carga automáticamente todas las entidades
//       //synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
//     }),
    
//     GraphQLModule.forRoot<ApolloDriverConfig>({
//       driver: ApolloDriver,
//       path: 'api/graphql',      
//       autoSchemaFile: join(process.cwd(), 'src/user/domain/schemas/schema.gql'),
//       include: [AppResolver, AuthResolver, UserResolver],
//       buildSchemaOptions: {
//         dateScalarMode: 'timestamp',
//       },      
//       playground: true,
//       debug: true,      
//       context: ({ req }) => ({ req }), // Importante para usar Guards de autenticación
//     }),
//     AuthModule,
//     UserModule,
//     DatabaseModule, // Elimínalo si solo contiene config de TypeORM repetida
//   ],
//   controllers: [AppController, GraphQLDocsController],
//   providers: [AppResolver, AppService],
// })
// export class AppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true,
      logging: true,
      logger: 'advanced-console',
      //synchronize: process.env.NODE_ENV !== 'production',

      
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: 'api/graphql',
      autoSchemaFile: join(process.cwd(), 'src/shared/graphql/schema.gql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
      playground: true,
      debug: true,
      
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, GraphQLDocsController, AppController], 
  providers: [AppResolver, AppService, UserResolver, AuthResolver, AuthModule],
})
export class AppModule {}