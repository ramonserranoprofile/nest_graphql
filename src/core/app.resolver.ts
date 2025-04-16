// src/core/app.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
    @Query(() => String)
    sayHello(): object {
        return {"message": "¡Bienvenido a la API!"};
    }
    
}