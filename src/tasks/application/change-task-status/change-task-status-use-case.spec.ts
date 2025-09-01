import { CreateStatusCommand } from "../../../statuses/application/create-status/create-status-command";
import { CreateTaskCommand } from "../create-task/create-task-command";
import { StatusRepository } from "../../../statuses/domain/status-repository";
import { CreateStatusUseCase } from "../../../statuses/application/create-status/create-status-use-case";
import { TaskRepository } from "../../../tasks/domain/task-repository";
import { CreateTaskUseCase } from "../create-task/create-task-use-case";
import { StatusNotFoundByIdError } from "../../../statuses/domain/errors/status-not-found-by-id-error";
import { CreateStatusResult } from "../../../statuses/application/create-status/create-status-result";
import { CreateTaskResult } from "../create-task/create-task-result";
import { ChangeTaskStatusCommand } from "./change-task-status-command";
import { ChangeTaskStatusUseCase } from "./change-task-status-use-case";
import { InMemoryTaskRepository } from "../../../tasks/infrastructure/persistence/in-memory-task-repository";
import { InMemoryStatusRepository } from "../../../statuses/infrastructure/persistence/in-memory-status-repository";
import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { EnsureTaskExistsById } from "../../../tasks/domain/services/ensure-task-exists-by-id";
import { TaskNotFoundByIdError } from "../../../tasks/domain/errors/task-not-found-by-id-error";
import { ChangeTaskStatusResult } from "./change-task-status-result";

describe('ChangeTaskStatusUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;

    let taskRepository: TaskRepository;
    let createTaskUseCase: CreateTaskUseCase;
    let changeTaskStatusUseCase: ChangeTaskStatusUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);

        taskRepository = new InMemoryTaskRepository();
        createTaskUseCase = new CreateTaskUseCase(taskRepository, new EnsureStatusExistsById(statusRepository));
        changeTaskStatusUseCase = new ChangeTaskStatusUseCase(
            taskRepository,
            new EnsureTaskExistsById(taskRepository),
            new EnsureStatusExistsById(statusRepository)
        );
    });

    it('should change task status when receieves valid inputs', () => {
        const pendingStatus = createStatus('Pendiente');
        const doneStatus = createStatus('Realizada');

        const task = createTask(pendingStatus.id, 'pasar la aspiradora');

        expect(changeTaskStatus(task.id, doneStatus.id))
            .toEqual({ id: task.id, statusId: doneStatus.id, title: task.title });
    });

    it('should throw error when task id not exists', () => {
        const nonExistentTaskId = 'b278bf16-7673-4e0e-b163-19e9d90fbd3b';
        const status = createStatus('Pendiente');

        expect(() => changeTaskStatus(nonExistentTaskId, status.id))
            .toThrow(TaskNotFoundByIdError);
    });

    it('should throw error when status id not exists', () => {
        const status = createStatus('Pendiente');

        const task = createTask(status.id, 'pasar la aspiradora');

        const nonExistentStatuskId = 'b278bf16-7673-4e0e-b163-19e9d90fbd3b';

        expect(() => changeTaskStatus(task.id, nonExistentStatuskId))
            .toThrow(StatusNotFoundByIdError);
    });

    function createStatus(name: string): CreateStatusResult {
        return createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    function createTask(statusId: string, title: string): CreateTaskResult {
        return createTaskUseCase.execute(new CreateTaskCommand(statusId, title));
    }

    function changeTaskStatus(taskId: string, statusId: string): ChangeTaskStatusResult {
        return changeTaskStatusUseCase.execute(new ChangeTaskStatusCommand(taskId, statusId));
    }
});