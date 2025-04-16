// src/shared/database/connections/database.providers.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/user/domain/entities/user.entity';
import { AuthSession } from 'src/auth/domain/entities/auth-session.entity';
config();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [User, AuthSession],
        migrations: [
        "src/shared/database/migrations/*{.ts,.js}"
        ],
      });
      return dataSource.initialize();
    },
  },
];