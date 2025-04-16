// create user.dto.ts
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsStrongPassword,
  Length 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { User } from '../../domain/entities/user.entity'; // Asegúrate de que la ruta sea correcta

// ==================== DTO PARA CREACIÓN ====================
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email (must be unique)',
    example: 'user@example.com'
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  @ApiProperty({
    description: 'Password (must include uppercase, lowercase, number and symbol)',
    example: 'P@ssw0rd123',
    minLength: 8
  })
  password: string;
}

// ==================== DTO PARA ACTUALIZACIÓN ====================
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @ApiProperty({
    required: false,
    description: 'Updated full name',
    example: 'Jane Doe'
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    description: 'Updated email',
    example: 'new.email@example.com'
  })
  email?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  @ApiProperty({
    required: false,
    description: 'New password',
    example: 'N3wP@ssword'
  })
  password?: string;
}

// ==================== DTO BASE PARA RESPUESTAS ====================
class BaseUserResponseDto {
  @Expose()
  @Transform(({ value }) => value.toString()) // Convierte ObjectId/UUID a string
  @ApiProperty({
    description: 'Unique user ID',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com'
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-02T00:00:00.000Z'
  })
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}

// ==================== DTOs ESPECÍFICOS ====================
export class UserResponseDto extends BaseUserResponseDto {
  @Exclude()
  @ApiProperty({ writeOnly: true })
  password: string;
}

export class UserListResponseDto extends BaseUserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Short summary (optional)',
    example: 'Active user'
  })
  summary?: string;
}

export class UserDetailResponseDto extends BaseUserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Additional details',
    example: { lastLogin: '2023-01-01T12:00:00.000Z' }
  })
  metadata?: Record<string, any>;
}

export class UserDeleteResponseDto extends BaseUserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Deletion status',
    example: 'success'
  })
  status: string;
}

// ==================== DTO PARA ELIMINACIÓN ====================
export class DeleteUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'ID of user to delete',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;
}