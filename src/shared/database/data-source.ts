import { DataSource } from "typeorm";
import { User } from "../../user/domain/entities/user.entity"; // Ajusta según tus entidades

export const AppDataSource = new DataSource({
    type: "postgres",
    url: "postgres://postgres:postgres@localhost:5432/nest_graphql",
    entities: [
        'src/**/*.entity{.ts,.js}',
        ],
    migrations: [
        "src/shared/database/migrations/*{.ts,.js}"
    ],
    synchronize: false, // IMPORTANTE: Debe ser false en producción
    logging: true,
    migrationsTableName: "typeorm_migrations"
});