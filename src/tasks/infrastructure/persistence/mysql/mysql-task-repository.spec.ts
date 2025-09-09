import { Connection, createConnection } from 'mysql2/promise';
import { MySqlStatusRepository } from '../../../../statuses/infrastructure/persistence/mysql/mysql-status-repository';
import { execute } from '../../../domain/repositories/task-repository.spec';
import { MySqlTaskRepository } from './mysql-task-repository';

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
        await connection.execute(`DELETE FROM tasks;`);
        await connection.execute(`DELETE FROM statuses;`);
    });

    execute(() => new MySqlTaskRepository(connection), () => new MySqlStatusRepository(connection));
});