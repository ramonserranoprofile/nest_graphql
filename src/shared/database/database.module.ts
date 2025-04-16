// Exporta el módulo de TypeOrm
// src/shared/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // Configuración global
  ],
  exports: [TypeOrmModule], // Exporta TypeOrmModule para que otros módulos lo usen
})
export class DatabaseModule {}