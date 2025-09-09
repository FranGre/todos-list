import { Global, Module } from '@nestjs/common';
import { createConnection } from 'mysql2/promise';

@Global()
@Module({
    providers: [
        {
            provide: 'DB_CONNECTION',
            useFactory: async () => {
                const connection = await createConnection({
                    host: 'localhost',
                    user: 'todolist_admin',
                    password: '2410',
                    database: 'todoslist',
                });
                return connection;
            },
        }
    ],
    exports: ['DB_CONNECTION'],
})
export class DatabaseModule { }
