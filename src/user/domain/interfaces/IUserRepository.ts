// src/auth/domain/interfaces/IUserRepository.ts
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;

  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
  findAllUsers(): Promise<User[]>;  
}