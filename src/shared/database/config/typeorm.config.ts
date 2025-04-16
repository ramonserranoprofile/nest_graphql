// src/shared/database/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {  
  type: 'postgres',
  
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nest_graphql',
  entities: [join(__dirname, '../../../**/*.entity{.js,.ts}')],
  migrations: [join(__dirname, '../migrations/*{.js,.ts}')],
  synchronize: false,
  logging: ['error', 'warn', 'info', 'migration', 'log', 'schema', 'query'], // Solo muestra errores y warnings,
  logger: 'advanced-console',
};