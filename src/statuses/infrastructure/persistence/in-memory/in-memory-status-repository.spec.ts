import { executeStatusRepositoryTests } from '../../../domain/repositories/status-repository.spec';
import { InMemoryStatusRepository } from './in-memory-status-repository';

describe('InMemoryStatusRepository', () => {
    executeStatusRepositoryTests(() => new InMemoryStatusRepository());
});
