import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
class AppResolver {
  @Query(() => String)
  hello() {
    return 'Hello, GraphQL!';
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Permite generar el esquema automáticamente
      introspection: true, // Habilita la introspección para GraphiQL
      playground: true, // Habilita GraphiQL en el navegador
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver], // Agregar el resolver aquí
})
export class AppModule {}
