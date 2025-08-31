import { StatusRepository } from "../../domain/status-repository";
import { StatusNameAlreadyExistsError } from "../../domain/errors/status-name-already-exists-error";
import { InMemoryStatusRepository } from "../../infrastructure/persistence/in-memory-status-repository";
import { CreateStatusCommand } from "./create-status-command";
import { CreateStatusUseCase } from "./create-status-use-case";

describe('CreateStatusUseCase', () => {
    let statusRepository: StatusRepository;
    let useCase: CreateStatusUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        useCase = new CreateStatusUseCase(statusRepository);
    });

    it('should create a status when receives valid name', () => {
        const command = new CreateStatusCommand('Pendiente');
        const result = useCase.execute(command);
        expect(result)
        .toEqual({id: result.id, name: command.name});
    });

    it('should throw error when status name already exists', () => {
        const command = new CreateStatusCommand('Realizadas');
        useCase.execute(command);
        expect(() => useCase.execute(command))
        .toThrow(StatusNameAlreadyExistsError);
    });
});