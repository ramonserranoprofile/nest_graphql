// src/auth/application/dtos/login-response.dto.ts
import { User } from '../../../user/domain/entities/user.entity';

export class LoginResponseDto {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user_id: string;

    constructor(
        access_token: string, 
        refresh_token: string,
        expires_in: number,
        user_id: string
    ) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.expires_in = expires_in;
        this.user_id = user_id;
        
    }
}