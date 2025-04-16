// src/auth/domain/services/auth.service.ts
import { Injectable, Inject, ConflictException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../../user/domain/interfaces/IUserRepository';
import { User } from '../../../user/domain/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterInput } from '../../application/dtos/auth.input';
import { AuthSession } from '../entities/auth-session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSessionStatus, AuthSessionType } from '../../../shared/enums/token-type.enum'; // Import the enum

@Injectable()
export class AuthService {  
    private readonly logger = new Logger(AuthService.name); // 👈 Instancia directa        
    constructor(
        @Inject('IUserRepository') 
        private readonly userRepo: IUserRepository, // Debe coincidir con el token de inyección
        private readonly jwtService: JwtService,        
        private readonly configService: ConfigService,        
        @InjectRepository(AuthSession)
        private readonly authSessionRepo: Repository<AuthSession>,
    
    ) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            return null; // Usuario no existe
        }
        // Verifica contraseña (usa bcrypt.compare)
        const isValid = await bcrypt.compare(pass, user.password);
        return isValid ? user : null;
        }

    async login(user: User): Promise<{
        id: string;
        email: string;
        name: string;
        access_token: string;
        refresh_token: string;
        expires_in: string;
    }> {
        this.logger.log(`[Login] Usuario recibido - ID: ${user.id}, Email: ${user.email}`);
        
        // 1. Obtener usuario completo
        const fullUser = await this.userRepo.findUserByEmail(user.email);
        if (!fullUser) throw new Error('Usuario no encontrado');

        // 2. Generar tokens
        const payload = { 
            sub: fullUser.id, 
            email: fullUser.email,
            name: fullUser.name
        };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

        // 3. Crear y guardar sesión
        const session = new AuthSession();
        session.user = fullUser;
        session.token = access_token;
        session.refreshToken = refresh_token;        
        session.type = AuthSessionType.ACCESS;
        session.status = AuthSessionStatus.ACTIVE;
        session.expiresAt = new Date(Date.now() + 3600 * 1000);

        try {
            await this.authSessionRepo.save(session);
            this.logger.log(`Sesión guardada exitosamente para usuario: ${fullUser.id}`);
        } catch (error) {
            this.logger.error('Error al guardar sesión', error.stack);
            throw error;
        }

        return {
            id: fullUser.id,
            email: fullUser.email,
            name: fullUser.name,
            access_token,
            refresh_token,
            expires_in: this.configService.get<string>('JWT_EXPIRES_IN')
        };
    }


    async register(userData: RegisterInput): Promise<{ user: User; access_token: string; refresh_token: string }> {
        // 1. Verificar si el usuario ya existe
        const existingUser = await this.userRepo.findUserByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('El correo electrónico ya está registrado');
        }

        // 2. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // 3. Crear el usuario
        const newUser = new User();
        newUser.name = userData.name;
        newUser.email = userData.email;
        newUser.password = hashedPassword;

        const createdUser = await this.userRepo.createUser(newUser);

        // 4. Generar token JWT
        const payload = { 
        sub: createdUser.id, 
        email: createdUser.email,
        name: createdUser.name
        };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

        // 5. Retornar usuario y token
        return {
        user: createdUser,
        access_token: access_token,
        refresh_token: refresh_token
        };
    }
    async logout(token: string): Promise<void> {
        // Implement the logout logic here, e.g., invalidate the token
        console.log(`Logging out with token: ${token}`);
    }
    async validateToken(token: string): Promise<User> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userRepo.findUserByEmail(decoded.email);
            return user;
        } catch (error) {
            return null;
        }
    }
    async getUserFromToken(token: string): Promise<User> {
        const decoded = this.jwtService.decode(token);
        if (decoded) {
            const user = await this.userRepo.findUserByEmail(decoded['email']);
            return user;
        }
        return null;
    }
    

    async handleOAuthLogin(profile: any) {
        let user = await this.userRepo.findUserByEmail(profile.emails[0].value);
        if (!user) {
        user = new User();
        user.email = profile.emails[0].value;
        user.name = profile.displayName;
        user.password = ''; // No password for OAuth users
        user = await this.userRepo.createUser(user);
        }
        return this.login(user);   
    }
}