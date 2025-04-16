// src/auth/application/dtos/auth.input.ts
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field()
  expires_in: string;
}