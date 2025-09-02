import { StatusRepository } from "../../../statuses/domain/status-repository";
import { CreateStatusUseCase } from "../../../statuses/application/create-status/create-status-use-case";
import { TaskRepository } from "../../../tasks/domain/task-repository";
import { CreateTaskUseCase } from "../create-task/create-task-use-case";
import { InMemoryStatusRepository } from "../../../statuses/infrastructure/persistence/in-memory-status-repository";
import { InMemoryTaskRepository } from "../../../tasks/infrastructure/persistence/in-memory-task-repository";
import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { CreateStatusResult } from "../../../statuses/application/create-status/create-status-result";
import { CreateTaskResult } from "../create-task/create-task-result";
import { CreateStatusCommand } from "../../../statuses/application/create-status/create-status-command";
import { CreateTaskCommand } from "../create-task/create-task-command";
import { TaskNotFoundByIdError } from "../../../tasks/domain/errors/task-not-found-by-id-error";
import { GetTaskResult } from "./get-task-result";
import { GetTaskQuery } from "./get-task-query";
import { GetTaskUseCase } from "./get-task-use-case";
import { EnsureTaskExistsById } from "../../../tasks/domain/services/ensure-task-exists-by-id";

describe('GetTaskUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;

    let taskRepository: TaskRepository;
    let createTaskUseCase: CreateTaskUseCase;
    let getTaskUseCase: GetTaskUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);

        taskRepository = new InMemoryTaskRepository();
        createTaskUseCase = new CreateTaskUseCase(taskRepository, new EnsureStatusExistsById(statusRepository));
        getTaskUseCase = new GetTaskUseCase(new EnsureTaskExistsById(taskRepository));
    });

    it('should return a task when task exists', () => {
        const pendingStatus = createStatus('Pendiente');

        const task = createTask(pendingStatus.id, 'pasar la aspiradora');

        expect(getTask(task.id))
            .toEqual({
                id: task.id,
                statusId: task.statusId,
                title: task.title
            });
    });

    it('should throw an error when task does not exists', () => {
        const nonExistentTaskId = 'b278bf16-7673-4e0e-b163-19e9d90fbd3b';
        expect(() => getTask(nonExistentTaskId))
            .toThrow(TaskNotFoundByIdError);
    });

    function createStatus(name: string): CreateStatusResult {
        return createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    function createTask(statusId: string, title: string): CreateTaskResult {
        return createTaskUseCase.execute(new CreateTaskCommand(statusId, title));
    }

    function getTask(id: string): GetTaskResult {
        return getTaskUseCase.execute(new GetTaskQuery(id));
    }
});