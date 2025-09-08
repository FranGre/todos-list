import { createConnection, Connection } from 'mysql2/promise';
import { executeStatusRepositoryTests } from '../../../domain/repositories/status-repository.spec';
import { MySqlStatusRepository } from './mysql-status-repository';

describe('MySqlStatusRepository', () => {
    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection({
            host: 'localhost',
            user: 'todolist_admin',
            password: '2410',
            database: 'todoslist',
        });
    });

    beforeEach(async () => {
        await connection.execute(`DELETE FROM statuses;`);
    });

    executeStatusRepositoryTests(() => new MySqlStatusRepository(connection));
});
