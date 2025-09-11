import { Module } from '@nestjs/common';
import { CreateStatusController } from './infrastructure/http/create-status/create-status-controller';
import { CreateStatusUseCase } from './application/create-status/create-status-use-case';
import { MySqlStatusRepository } from './infrastructure/persistence/mysql/mysql-status-repository';
import { StatusRepository } from './domain/repositories/status-repository';

@Module({
    controllers: [CreateStatusController],
    providers: [
        {
            provide: StatusRepository,
            useClass: MySqlStatusRepository
        },
        CreateStatusUseCase
    ],
})
export class StatusesModule { }
