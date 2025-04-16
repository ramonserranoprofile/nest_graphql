// src/user/domain/entities/user.entity.ts
import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AuthSession } from '../../../auth/domain/entities/auth-session.entity';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
@Entity('users')
export class User {
    @ApiProperty({ example: '50e26c95-383b-4b17-9e62-9849c7d3d123', description: 'ID único del usuario' })
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;
    
    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
    @Field()
    @Column({ type: 'varchar', length: 255, nullable: false })    
    name: string;

    @ApiProperty({ example: 'juan@example.com', description: 'Email único del usuario' })
    @Field()
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })    
    email: string;

    @ApiProperty({ description: 'Contraseña hasheada' })
    @Column({ type: 'varchar', nullable: false })
    //@HideField() // Ocultar en GraphQL
    password: string;

    @ApiProperty({ type: Date, description: 'Fecha de creación' })
    @Field()
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', nullable: false })    
    createdAt: Date;

    @ApiProperty({ type: Date, description: 'Fecha de última actualización' })
    @Field()
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: false })    
    updatedAt: Date;

    // @ApiProperty({ type: Date, required: false, description: 'Fecha de expiración' })
    // @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
    // @Field({ nullable: true })
    // expiresAt?: Date;
    
    @ApiProperty({ type: () => [AuthSession], description: 'Sesiones de autenticación' })
    @Field(() => [AuthSession], { nullable: true }) // Tipo explícito como array
    @OneToMany(() => AuthSession, (session) => session.user)
    @Field(() => [AuthSession], { nullable: true })
    sessions?: AuthSession[];
}