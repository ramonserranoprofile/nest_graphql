// src/auth/infrastructure/database/repositories/user.repository.ts
import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';


@Injectable()
export class UserRepository implements IUserRepository {
    private readonly logger = new Logger(UserRepository.name);

    constructor(
        @InjectRepository(User)
        private readonly typeOrmRepository: Repository<User>,
    ) {}

    async findById(id: string): Promise<User | null> {
        try {
            return await this.typeOrmRepository.findOne({ 
                where: { id },
                cache: true, // Opcional: cache para consultas frecuentes
            });
        } catch (error) {
            this.logger.error(`Error finding user by ID ${id}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve user');
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.typeOrmRepository.findOne({ 
                where: { email },
            });
        } catch (error) {
            this.logger.error(`Error finding user by email ${email}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve user by email');
        }
    }

    async createUser(user: User): Promise<User> {
        try {
            const result = await this.typeOrmRepository.save(user);
            this.logger.log(`User created with ID: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error('Error creating user', error.stack);
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async updateUser(user: User): Promise<User> {
        try {
            const updateResult = await this.typeOrmRepository.update(user.id, user);
            
            if (updateResult.affected === 0) {
                throw new NotFoundException(`User with ID ${user.id} not found`);
            }

            return await this.findById(user.id);
        } catch (error) {
            this.logger.error(`Error updating user ${user.id}`, error.stack);
            if (error ) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            const deleteResult: DeleteResult = await this.typeOrmRepository.delete(id);
            
            if (deleteResult.affected === 0) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            
            this.logger.log(`User deleted with ID: ${id}`);
        } catch (error) {
            this.logger.error(`Error deleting user ${id}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete user');
        }
    }

    async findAllUsers(): Promise<User[]> {
        try {
            return await this.typeOrmRepository.find({
                order: { name: 'DESC' }, // Ordenar por fecha de creación
                take: 100, // Límite de resultados
            });
        } catch (error) {
            this.logger.error('Error retrieving all users', error.stack);
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    // Método adicional útil
    async existsByEmail(email: string): Promise<boolean> {
        try {
            const count = await this.typeOrmRepository.count({ where: { email } });
            return count > 0;
        } catch (error) {
            this.logger.error(`Error checking if email exists: ${email}`, error.stack);
            throw new InternalServerErrorException('Failed to check email existence');
        }
    }
}