import { execute } from '../../../domain/repositories/status-repository.spec';
import { InMemoryStatusRepository } from './in-memory-status-repository';

const inMemoryStatusRepository = new InMemoryStatusRepository();
execute(inMemoryStatusRepository);