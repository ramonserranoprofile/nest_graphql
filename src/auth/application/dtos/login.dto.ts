// src/auth/application/dtos/login.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    
    
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
}