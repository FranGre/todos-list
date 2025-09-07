import { StatusRepository } from "../../domain/repositories/status-repository";
import { StatusNameAlreadyExistsError } from "../../domain/errors/status-name-already-exists-error";
import { InMemoryStatusRepository } from "../../infrastructure/persistence/in-memory/in-memory-status-repository";
import { CreateStatusCommand } from "./create-status-command";
import { CreateStatusUseCase } from "./create-status-use-case";
import { CreateStatusResult } from "./create-status-result";

describe('CreateStatusUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);
    });

    it('should create a status when receives valid name', () => {
        const status = createStatus('Pendiente');
        expect(status)
            .toEqual({ id: status.id, name: status.name });
    });

    describe('errors', () => {
        it('should throw error when status name already exists', () => {
            createStatus('Realizadas');
            expect(() => createStatus('Realizadas'))
                .toThrow(StatusNameAlreadyExistsError);
        });
    });

    function createStatus(name: string): CreateStatusResult {
        return createStatusUseCase.execute(new CreateStatusCommand(name));
    }
});