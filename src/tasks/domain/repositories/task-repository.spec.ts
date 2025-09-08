import { TaskId } from "../value-objects/task-id/task-id";
import { TaskTitle } from "../value-objects/task-title/task-title";
import { Task } from "../task";
import { StatusRepository } from "../../../statuses/domain/repositories/status-repository";
import { Status } from "../../../statuses/domain/status";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { StatusName } from "../../../statuses/domain/value-objects/status-name/status-name";
import { GetTasksCriteria } from "../criteria/get-tasks-criteria";
import { TaskRepository } from "./task-repository";

export function execute(taskFactory: () => TaskRepository, statusFactory: () => StatusRepository) {
    describe('TaskRepository', () => {
        let taskRepository: TaskRepository;
        let statusRepository: StatusRepository;

        beforeEach(() => {
            taskRepository = taskFactory();
            statusRepository = statusFactory();
        });

        describe('create', () => {
            it('should store a task', async () => {
                const pending = await createStatus('Pendiente');

                const task = await createTask(pending.id().value(), 'Hacer la cama');

                expect(await taskRepository.findById(task.id()))
                    .toEqual(task);
            });
        });

        describe('findById', () => {
            it('should return the task when it exists', async () => {
                const pending = await createStatus('Pendiente');

                const task = await createTask(pending.id().value(), 'Hacer la cama');

                expect(await taskRepository.findById(task.id()))
                    .toEqual(task);
            });

            it('should return null when it does not exist', async () => {
                const notExistentId = new TaskId();

                expect(await taskRepository.findById(notExistentId))
                    .toBeNull();
            });
        });

        describe('remove', () => {
            it('should remove a task when it exists', async () => {
                const pending = await createStatus('Pendiente');

                const task = await createTask(pending.id().value(), 'Hacer la cama');

                await taskRepository.remove(task.id());

                expect(await taskRepository.findById(task.id()))
                    .toBeNull();
            });

            it('should do nothing when status does not exist', async () => {
                const notExistentId = new TaskId();

                await taskRepository.remove(notExistentId);

                expect(await taskRepository.findById(notExistentId))
                    .toBeNull();
            });
        });

        describe('getByStatusId', () => {
            it('should return only tasks that match the given status id', async () => {
                const pending = await createStatus('Pendiente');
                const completed = await createStatus('Completed');

                const hacerLaCama = await createTask(completed.id().value(), 'Hacer la cama');
                const limpiarElPolvo = await createTask(completed.id().value(), 'Limpiar el polvo');
                const aspirar = await createTask(pending.id().value(), 'aspirar');
                const mochar = await createTask(pending.id().value(), 'mochar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(new StatusId(pending.id().value()))))
                    .toEqual([
                        aspirar,
                        mochar
                    ]);
            });

            it('should return an empty array when no statuses match the given name', async () => {
                const pending = await createStatus('Pendiente');
                const completed = await createStatus('Completed');
                const cancelled = await createStatus('Cancelled');

                const hacerLaCama = await createTask(completed.id().value(), 'Hacer la cama');
                const limpiarElPolvo = await createTask(completed.id().value(), 'Limpiar el polvo');
                const aspirar = await createTask(pending.id().value(), 'aspirar');
                const mochar = await createTask(pending.id().value(), 'mochar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(new StatusId(cancelled.id().value()))))
                    .toEqual([]);
            });

        });

        describe('getByFilters', () => {
            it('should return all tasks when no filters are provided', async () => {
                const pending = await createStatus('Pendiente');

                const hacerLaCama = await createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = await createTask(pending.id().value(), 'Recoger la ropa');

                expect(await taskRepository.getByFilters(new GetTasksCriteria()))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given status id', async () => {
                const pending = await createStatus('Pendiente');
                const done = await createStatus('Done');

                const hacerLaCama = await createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = await createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = await createTask(done.id().value(), 'Aspirar');
                const fregar = await createTask(done.id().value(), 'Fregar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(pending.id())))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given title', async () => {
                const pending = await createStatus('Pendiente');
                const done = await createStatus('Done');

                const hacerLaCama = await createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = await createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = await createTask(done.id().value(), 'Aspirar');
                const fregar = await createTask(done.id().value(), 'Fregar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(undefined, new TaskTitle('la'))))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given status id and title', async () => {
                const pending = await createStatus('Pendiente');
                const done = await createStatus('Done');

                const hacerLaCama = await createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = await createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = await createTask(done.id().value(), 'Aspirar');
                const fregar = await createTask(done.id().value(), 'Fregar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(pending.id(), new TaskTitle('cama'))))
                    .toEqual([
                        hacerLaCama
                    ]);
            });


            it('should return an empty array when no tasks match the given status id', async () => {
                const pending = await createStatus('Pendiente');
                const done = await createStatus('Done');

                const hacerLaCama = await createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = await createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = await createTask(pending.id().value(), 'Aspirar');
                const fregar = await createTask(pending.id().value(), 'Fregar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(done.id())))
                    .toEqual([]);
            });

            it('should return an empty array when no tasks match the given title', async () => {
                const pending = await createStatus('Pendiente');

                const hacerLaCama = await createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = await createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = await createTask(pending.id().value(), 'Aspirar');
                const fregar = await createTask(pending.id().value(), 'Fregar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(undefined, new TaskTitle('Cocina'))))
                    .toEqual([]);
            });

            it('should return an empty array when no tasks match the given status id and title', async () => {
                const pending = await createStatus('Pendiente');
                const done = await createStatus('Done');

                const hacerLaCama = await createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = await createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = await createTask(pending.id().value(), 'Aspirar');
                const fregar = await createTask(done.id().value(), 'Fregar');

                expect(await taskRepository.getByFilters(new GetTasksCriteria(done.id(), new TaskTitle('tenedor'))))
                    .toEqual([]);
            });
        });

        async function createStatus(name: string): Promise<Status> {
            const status = new Status(new StatusId, new StatusName(name));
            await statusRepository.create(status);
            return status;
        }

        async function createTask(statusId: string, name: string): Promise<Task> {
            const task = new Task(new TaskId, new StatusId(statusId), new TaskTitle(name));
            await taskRepository.create(task);
            return task;
        }
    });
}