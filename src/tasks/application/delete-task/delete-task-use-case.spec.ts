import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { CreateStatusCommand } from "../../../statuses/application/create-status/create-status-command";
import { CreateStatusUseCase } from "../../../statuses/application/create-status/create-status-use-case";
import { StatusRepository } from "../../../statuses/domain/repositories/status-repository";
import { InMemoryStatusRepository } from "../../../statuses/infrastructure/persistence/in-memory/in-memory-status-repository";
import { CreateTaskCommand } from "../create-task/create-task-command";
import { CreateTaskUseCase } from "../create-task/create-task-use-case";
import { TaskRepository } from "../../domain/repositories/task-repository";
import { InMemoryTaskRepository } from "../../infrastructure/persistence/in-memory/in-memory-task-repository";
import { DeleteTaskCommand } from "./delete-task-command";
import { DeleteTaskUseCase } from "./delete-task-use-case";
import { EnsureTaskExistsById } from "../../domain/services/ensure-task-exists-by-id";
import { TaskNotFoundByIdError } from "../../domain/errors/task-not-found-by-id-error";
import { TaskId } from "../../domain/value-objects/task-id/task-id";
import { CreateStatusResult } from "../../../statuses/application/create-status/create-status-result";
import { CreateTaskResult } from "../create-task/create-task-result";
import { DeleteTaskResult } from "./delete-task-result";

describe('DeleteTaskUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;

    let taskRepository: TaskRepository;
    let createTaskUseCase: CreateTaskUseCase;
    let deleteTaskUseCase: DeleteTaskUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);

        taskRepository = new InMemoryTaskRepository();
        createTaskUseCase = new CreateTaskUseCase(taskRepository, new EnsureStatusExistsById(statusRepository));
        deleteTaskUseCase = new DeleteTaskUseCase(taskRepository, new EnsureTaskExistsById(taskRepository));
    });

    it('should delete a task when task exists', () => {
        const createStatusResult = createStatus('Pendiente');
        const createTaskResult = createTask(createStatusResult.id, 'pasar la aspiradora');

        expect(deleteTask(createTaskResult.id))
            .toEqual({ id: createTaskResult.id });

        expect(taskRepository.findById(new TaskId(createTaskResult.id)))
            .toBeNull();
    });

    describe('errors', () => {
        it('should throw error when task id not exists', () => {
            const notExistsTaskId = 'b278bf16-7673-4e0e-b163-19e9d90fbd3b';
            expect(() => deleteTask(notExistsTaskId))
                .toThrow(TaskNotFoundByIdError);
        });
    });

    function createStatus(name: string): CreateStatusResult {
        return createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    function createTask(statusId: string, title: string): CreateTaskResult {
        return createTaskUseCase.execute(new CreateTaskCommand(statusId, title));
    }

    function deleteTask(id): DeleteTaskResult {
        return deleteTaskUseCase.execute(new DeleteTaskCommand(id));
    }

});