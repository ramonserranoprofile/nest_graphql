// src/auth/application/dtos/login.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn } from 'typeorm';

export class RegisterDto {
    // crear id
    @ApiProperty({
        example: '1',
        description: 'id del usuario',
        required: true,
        type: String,
    })
    @IsString({ message: 'El id debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El id no puede estar vacío' })
    @MaxLength(100, { message: 'El id no puede exceder los 100 caracteres' })
    id: string;

    @ApiProperty({
        example: 'nombre del usuario',
        description: 'nombre del usuario',
        required: true,
        type: String,
    })    
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    name: string;
    
    @ApiProperty({
        example: 'usuario@example.com',
        description: 'Correo electrónico del usuario',
        required: true,
        type: String,
    })
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
    @MaxLength(100, { message: 'El correo no puede exceder los 100 caracteres' })
    email: string;

    @ApiProperty({
        example: 'PasswordSeguro123!',
        description: 'Contraseña del usuario (mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial)',
        required: true,
        type: String,
    })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(50, { message: 'La contraseña no puede exceder los 50 caracteres' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
        message:
            'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)',
        }
    )
    password: string;

    // crear createdAt
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Fecha de creación del usuario',
        required: true,
        type: Date,
    })
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', nullable: false })
    @IsNotEmpty({ message: 'La fecha de creación no puede estar vacía' })
    createdAt: Date;
    // crear updatedAt
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Fecha de actualización del usuario',
        required: true,
        type: Date,
    })
    @CreateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: false })
    @IsNotEmpty({ message: 'La fecha de modificación no puede estar vacía' })
    updatedAt: Date;
    // crear expiredAt
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Fecha de expiración del token',
        required: true,
        type: Date,
    })
    @CreateDateColumn({ name: 'expires_at', type: 'timestamptz', nullable: false })
    @IsNotEmpty({ message: 'La fecha de expiración no puede estar vacía' })
    expiresAt: Date;
    @CreateDateColumn({ name: 'expires_at', type: 'timestamptz', nullable: false })
    @IsNotEmpty({ message: 'La fecha de actualización no puede estar vacía' })
    expiresdAt: Date;
}