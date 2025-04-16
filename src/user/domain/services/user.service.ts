// src/auth/domain/services/user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') // Usa el token de la interfaz
    private readonly userRepository: IUserRepository,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email);
  }
  
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  async createUser(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }
  async updateUser(user: User): Promise<User> {
    return this.userRepository.updateUser(user);
  }
  async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }
  async findOrCreateUser(profile: any): Promise<User> {
    const user = await this.userRepository.findUserByEmail(profile.email);
    if (user) {
      return user;
    }
    const newUser = new User();
    newUser.email = profile.email;
    newUser.name = profile.name;
    // Asigna otros campos necesarios
    return this.userRepository.createUser(newUser);
  }
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }
  // async findUserByIdWithRelations(id: string): Promise<User | null> {
  //   return this.userRepository.findUserByIdWithRelations(id);
  // }
  // async findUserByEmailWithRelations(email: string): Promise<User | null> {
  //   return this.userRepository.findUserByEmailWithRelations(email);
  // }
  // async findUserByIdWithRelationsAndRoles(id: string): Promise<User | null> {
  //   return this.userRepository.findUserByIdWithRelationsAndRoles(id);
  // }
  // async findUserByEmailWithRelationsAndRoles(email: string): Promise<User | null> {
  //   return this.userRepository.findUserByEmailWithRelationsAndRoles(email);
  // }
  // async findUserByIdWithRelationsAndPermissions(id: string): Promise<User | null> {
  //   return this.userRepository.findUserByIdWithRelationsAndPermissions(id);
  // }
  

}