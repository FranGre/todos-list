import { InMemoryStatusRepository } from '../../../../statuses/infrastructure/persistence/in-memory/in-memory-status-repository';
import { execute } from '../../../domain/repositories/task-repository.spec';
import { InMemoryTaskRepository } from './in-memory-task-repository';

execute(() => new InMemoryTaskRepository(), () => new InMemoryStatusRepository());