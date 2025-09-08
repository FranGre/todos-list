import { StatusRepository } from "../../../statuses/domain/repositories/status-repository";
import { CreateStatusUseCase } from "../../../statuses/application/create-status/create-status-use-case";
import { TaskRepository } from "../../domain/repositories/task-repository";
import { CreateTaskUseCase } from "../create-task/create-task-use-case";
import { InMemoryStatusRepository } from "../../../statuses/infrastructure/persistence/in-memory/in-memory-status-repository";
import { InMemoryTaskRepository } from "../../infrastructure/persistence/in-memory/in-memory-task-repository";
import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { CreateStatusResult } from "../../../statuses/application/create-status/create-status-result";
import { CreateTaskResult } from "../create-task/create-task-result";
import { CreateStatusCommand } from "../../../statuses/application/create-status/create-status-command";
import { CreateTaskCommand } from "../create-task/create-task-command";
import { StatusNotFoundByIdError } from "../../../statuses/domain/errors/status-not-found-by-id-error";
import { TaskTitleTooLongError } from "../../../tasks/domain/errors/task-title-too-long-error";
import { GetTaskResult } from "../get-task/get-task-result";
import { GetTasksUseCase } from "./get-tasks-use-case";
import { GetTasksQuery } from "./get-tasks-query";

describe('GetTasksUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;

    let taskRepository: TaskRepository;
    let createTaskUseCase: CreateTaskUseCase;
    let getTasksUseCase: GetTasksUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);

        taskRepository = new InMemoryTaskRepository();
        createTaskUseCase = new CreateTaskUseCase(taskRepository, new EnsureStatusExistsById(statusRepository));
        getTasksUseCase = new GetTasksUseCase(taskRepository, new EnsureStatusExistsById(statusRepository));
    });

    describe('filters', () => {
        it('should return all tasks', async () => {
            const pendingStatus = await createStatus('Pendiente');

            const task1 = await createTask(pendingStatus.id, 'limpiar el polvo');
            const task2 = await createTask(pendingStatus.id, 'pasar la aspiradora');
            const task3 = await createTask(pendingStatus.id, 'mochar');

            expect(await getTasks())
                .toEqual(
                    [
                        {
                            id: task1.id,
                            statusId: task1.statusId,
                            title: task1.title
                        },
                        {
                            id: task2.id,
                            statusId: task2.statusId,
                            title: task2.title
                        },
                        {
                            id: task3.id,
                            statusId: task3.statusId,
                            title: task3.title
                        }
                    ]
                );
        });

        it('should return all tasks when filtered by status id', async () => {
            const pendingStatus = await createStatus('Pendiente');
            const doneStatus = await createStatus('Done');

            const task1 = await createTask(pendingStatus.id, 'limpiar el cuarto');
            const task2 = await createTask(pendingStatus.id, 'limpiar el aseo');
            const task3 = await createTask(pendingStatus.id, 'limpiar la cocina');
            await createTask(doneStatus.id, 'comprar pan');

            expect(await getTasks(pendingStatus.id, undefined))
                .toEqual(
                    [
                        {
                            id: task1.id,
                            statusId: task1.statusId,
                            title: task1.title
                        },
                        {
                            id: task2.id,
                            statusId: task2.statusId,
                            title: task2.title
                        },
                        {
                            id: task3.id,
                            statusId: task3.statusId,
                            title: task3.title
                        }
                    ]
                );
        });

        it('should return all tasks when filtered by title', async () => {
            const pendingStatus = await createStatus('Pendiente');
            const doneStatus = await createStatus('Done');

            const task1 = await createTask(pendingStatus.id, 'limpiar el cuarto');
            const task2 = await createTask(pendingStatus.id, 'limpiar el aseo');
            const task3 = await createTask(pendingStatus.id, 'limpiar la cocina');
            await createTask(doneStatus.id, 'comprar pan');

            expect(await getTasks(undefined, 'limpiar'))
                .toEqual(
                    [
                        {
                            id: task1.id,
                            statusId: task1.statusId,
                            title: task1.title
                        },
                        {
                            id: task2.id,
                            statusId: task2.statusId,
                            title: task2.title
                        },
                        {
                            id: task3.id,
                            statusId: task3.statusId,
                            title: task3.title
                        }
                    ]
                );
        });

        it('should return all tasks when filtered by status id and title', async () => {
            const pendingStatus = await createStatus('Pendiente');
            const doneStatus = await createStatus('Done');

            const task1 = await createTask(doneStatus.id, 'limpiar el cuarto de fran');
            const task2 = await createTask(doneStatus.id, 'limpiar la cocina');
            await createTask(pendingStatus.id, 'limpiar el cuarto de j');
            await createTask(pendingStatus.id, 'limpar el comedor');
            await createTask(doneStatus.id, 'comprar pan');

            expect(await getTasks(doneStatus.id, 'limpiar'))
                .toEqual(
                    [
                        {
                            id: task1.id,
                            statusId: task1.statusId,
                            title: task1.title
                        },
                        {
                            id: task2.id,
                            statusId: task2.statusId,
                            title: task2.title
                        }
                    ]
                );
        });

        it('should return an empty array when no task title matches', async () => {
            const pendingStatus = await createStatus('Pendiente');

            createTask(pendingStatus.id, 'limpiar el polvo');
            createTask(pendingStatus.id, 'pasar la aspiradora');
            createTask(pendingStatus.id, 'mochar');

            const titleNoCoindices = 'jugar';

            expect(await getTasks(undefined, titleNoCoindices))
                .toEqual([]);
        });
    });

    describe('errors', () => {
        it('should throw error when status does not exists', () => {
            const nonExistentStatusId = 'a04f6265-c19b-4cf2-b3c3-c16fbff54bba';

            expect(() => getTasks(nonExistentStatusId))
                .toThrow(StatusNotFoundByIdError);
        });

        it('should throw error when task title filter is too long', () => {
            const tooLongTitle = 'a'.repeat(51);

            expect(() => getTasks(undefined, tooLongTitle))
                .toThrow(TaskTitleTooLongError);
        });
    });

    async function createStatus(name: string): Promise<CreateStatusResult> {
        return await createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    function createTask(statusId: string, title: string): CreateTaskResult {
        return createTaskUseCase.execute(new CreateTaskCommand(statusId, title));
    }

    function getTasks(statusId?: string, title?: string): GetTaskResult[] {
        return getTasksUseCase.execute(new GetTasksQuery(statusId, title));
    }
});