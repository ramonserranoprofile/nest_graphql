// src/auth/presentation/resolvers/user.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { User } from '../../domain/entities/user.entity';

@Resolver()
export class UserResolver {  

  @Query(() => [User])
  users() {
    return [{ id: '1', name: 'Test', email: 'test@test.com' }];
  }
}