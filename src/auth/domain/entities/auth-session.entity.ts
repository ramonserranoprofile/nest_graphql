// src/auth/domain/entities/auth-session.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { AuthSessionType, AuthSessionStatus } from '../../../shared/enums/token-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../user/domain/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType() 
@Entity('auth_sessions')
@Index(['id']) // Índice para mejorar búsquedas por usuario
export class AuthSession {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8', description: 'ID único de la sesión' })
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT de acceso' })
    @Field()
    @Column({ type: 'varchar', length: 512, nullable: false })
    token: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh Token JWT' })
    @Field()
    @Column({ type: 'varchar', length: 512, nullable: false, name: 'refresh_token' })
    refreshToken: string; // Usando camelCase en el modelo

    @ApiProperty({ enum: AuthSessionType, example: AuthSessionType.ACCESS, description: 'Tipo de sesión' })
    @Field(() => String)
    @Column({
        type: 'enum',
        enum: AuthSessionType,
        default: AuthSessionType.ACCESS,
        nullable: false
    })
    type: AuthSessionType;

    @ApiProperty({ enum: AuthSessionStatus, example: AuthSessionStatus.ACTIVE, description: 'Estado de la sesión' })
    @Field(() => String)
    @Column({
        type: 'enum',
        enum: AuthSessionStatus,
        default: AuthSessionStatus.ACTIVE,
        nullable: false
    })
    status: AuthSessionStatus;

    @ApiProperty({ type: Date, description: 'Fecha de creación' })
    @Field()
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', nullable: false })
    createdAt: Date;

    @ApiProperty({ type: Date, required: false, description: 'Fecha de expiración' })
    @Field({ nullable: true })
    @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
    expiresAt?: Date;

    @ApiProperty({ type: Date, description: 'Fecha de última actualización' })
    @Field()
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: false })
    updatedAt: Date;

    
    @ApiProperty({ type: () => User, description: 'Usuario asociado' })
    @Field(() => User) // Tipo explícito para GraphQL
    @ManyToOne(() => User, (user) => user.sessions, { 
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user: User;
}