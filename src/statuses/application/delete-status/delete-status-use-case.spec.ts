import { StatusRepository } from "../../domain/status-repository";
import { InMemoryStatusRepository } from "../../infrastructure/persistence/in-memory-status-repository";
import { CreateStatusUseCase } from "../create-status/create-status-use-case";
import { CreateStatusCommand } from "../create-status/create-status-command";
import { CreateStatusResult } from "../create-status/create-status-result";
import { StatusNotFoundByIdError } from "../../../statuses/domain/errors/status-not-found-by-id-error";
import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { TaskRepository } from "../../../tasks/domain/task-repository";
import { CreateTaskUseCase } from "../../../tasks/application/create-task/create-task-use-case";
import { InMemoryTaskRepository } from "../../../tasks/infrastructure/persistence/in-memory-task-repository";
import { CreateTaskResult } from "../../../tasks/application/create-task/create-task-result";
import { CreateTaskCommand } from "../../../tasks/application/create-task/create-task-command";
import { DeleteStatusCommand } from "./delete-status-command";
import { DeleteStatusUseCase } from "./delete-status-use-case";
import { DeleteStatusResult } from "./delete-status-result";
import { StatusHasAssociatedTasksError } from "../../../statuses/domain/errors/status-has-associated-tasks-error";
import { EnsureStatusHasNoAssociatedTasks } from "../../../tasks/domain/services/ensure-status-has-no-associated-tasks";

describe('DeleteStatusUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;
    let deleteStatusUseCase: DeleteStatusUseCase;

    let taskRepository: TaskRepository;
    let createTaskUseCase: CreateTaskUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);

        taskRepository = new InMemoryTaskRepository();
        createTaskUseCase = new CreateTaskUseCase(taskRepository, new EnsureStatusExistsById(statusRepository));

        deleteStatusUseCase = new DeleteStatusUseCase(
            statusRepository,
            new EnsureStatusExistsById(statusRepository),
            new EnsureStatusHasNoAssociatedTasks(taskRepository)
        );
    });

    it('should delete a status when status exists and has no associated tasks', () => {
        const status = createStatus('Pendiente');

        expect(deleteStatus(status.id))
            .toEqual({ id: status.id });
    });

    describe('errros', () => {
        it('should throw error when status has associated tasks', () => {
            const status = createStatus('Pendiente');

            createTask(status.id, 'Hacer la cama');

            expect(() => deleteStatus(status.id))
                .toThrow(StatusHasAssociatedTasksError);
        });

        it('should throw error when status does not exists', () => {
            const nonExistentStatusId = '9f9f23f7-53ee-4986-aad8-bfa0305585e7';

            expect(() => deleteStatus(nonExistentStatusId))
                .toThrow(StatusNotFoundByIdError);
        });
    });

    function createStatus(name: string): CreateStatusResult {
        return createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    function deleteStatus(id: string): DeleteStatusResult {
        return deleteStatusUseCase.execute(new DeleteStatusCommand(id));
    }

    function createTask(statusId: string, title: string): CreateTaskResult {
        return createTaskUseCase.execute(new CreateTaskCommand(statusId, title));
    }
});