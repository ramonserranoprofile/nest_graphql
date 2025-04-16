// src/auth/domain/services/session-cleanup.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSession } from '../entities/auth-session.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SessionCleanupService {
    private readonly logger = new Logger(SessionCleanupService.name); // Usa el Logger de Nest
    constructor(
    @InjectRepository(AuthSession)
        private readonly authSessionRepo: Repository<AuthSession>,
    ) {}


    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanExpiredSessions(): Promise<void> {
        const result: DeleteResult = await this.authSessionRepo
        .createQueryBuilder()
        .delete()
        .where('expires_at < :now', { now: new Date() })
        .execute();

        this.logger.log(`[CLEANUP] Eliminadas ${result.affected} sesiones expiradas`); // Mejor práctica que console.log
        
        // Opcional: Notificar si no se eliminó nada
        if (result.affected === 0) {
        this.logger.debug('No se encontraron sesiones expiradas para limpiar');
        }
    }
}