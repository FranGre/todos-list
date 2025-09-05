import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { CreateStatusCommand } from "../../../statuses/application/create-status/create-status-command";
import { CreateStatusUseCase } from "../../../statuses/application/create-status/create-status-use-case";
import { StatusRepository } from "../../../statuses/domain/status-repository";
import { InMemoryStatusRepository } from "../../../statuses/infrastructure/persistence/in-memory-status-repository";
import { CreateTaskCommand } from "./create-task-command";
import { CreateTaskUseCase } from "./create-task-use-case";
import { TaskRepository } from "../../domain/task-repository";
import { InMemoryTaskRepository } from "../../infrastructure/persistence/in-memory-task-repository";
import { StatusNotFoundByIdError } from "../../../statuses/domain/errors/status-not-found-by-id-error";

describe('CreateTaskUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;

    let taskRepository: TaskRepository;
    let createTaskUseCase: CreateTaskUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);

        taskRepository = new InMemoryTaskRepository();
        createTaskUseCase = new CreateTaskUseCase(taskRepository, new EnsureStatusExistsById(statusRepository));
    });

    it('should create a task when recieves valid inputs', () => {
        const createStatusCommand = new CreateStatusCommand('Pendiente');
        const createStatusResult = createStatusUseCase.execute(createStatusCommand);

        const command = new CreateTaskCommand(createStatusResult.id, 'pasar la aspiradora');
        const result = createTaskUseCase.execute(command);
        expect(result)
            .toEqual({ id: result.id, statusId: command.statusId, title: command.title });
    });

    describe('errors', () => {
        it('should throw error when status id not exists', () => {
            const notExistsStatudId = 'b278bf16-7673-4e0e-b163-19e9d90fbd3b';
            const command = new CreateTaskCommand(notExistsStatudId, 'ir a comprar pan');
            expect(() => createTaskUseCase.execute(command))
                .toThrow(StatusNotFoundByIdError);
        });
    });
});