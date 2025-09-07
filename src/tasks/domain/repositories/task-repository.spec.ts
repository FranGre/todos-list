import { InMemoryTaskRepository } from "../../../tasks/infrastructure/persistence/in-memory/in-memory-task-repository";
import { TaskId } from "../value-objects/task-id/task-id";
import { TaskTitle } from "../value-objects/task-title/task-title";
import { Task } from "../task";
import { StatusRepository } from "../../../statuses/domain/repositories/status-repository";
import { Status } from "../../../statuses/domain/status";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { StatusName } from "../../../statuses/domain/value-objects/status-name/status-name";
import { GetTasksCriteria } from "../criteria/get-tasks-criteria";
import { InMemoryStatusRepository } from "../../../statuses/infrastructure/persistence/in-memory/in-memory-status-repository";
import { TaskRepository } from "./task-repository";

export function execute(taskRepository: TaskRepository, statusRepository: StatusRepository) {
    describe('TaskRepository', () => {

        beforeEach(() => {
            taskRepository = new InMemoryTaskRepository();
            statusRepository = new InMemoryStatusRepository();
        });

        describe('create', () => {
            it('should store a task', () => {
                const pending = createStatus('Pendiente');

                const task = createTask(pending.id().value(), 'Hacer la cama');

                expect(taskRepository.findById(task.id()))
                    .toEqual(task);
            });
        });

        describe('findById', () => {
            it('should return the task when it exists', () => {
                const pending = createStatus('Pendiente');

                const task = createTask(pending.id().value(), 'Hacer la cama');

                expect(taskRepository.findById(task.id()))
                    .toEqual(task);
            });

            it('should return null when it does not exist', () => {
                const notExistentId = new TaskId();

                expect(taskRepository.findById(notExistentId))
                    .toBeNull();
            });
        });

        describe('remove', () => {
            it('should remove a task when it exists', () => {
                const pending = createStatus('Pendiente');

                const task = createTask(pending.id().value(), 'Hacer la cama');

                taskRepository.remove(task.id());

                expect(taskRepository.findById(task.id()))
                    .toBeNull();
            });

            it('should do nothing when status does not exist', () => {
                const notExistentId = new TaskId();

                taskRepository.remove(notExistentId);

                expect(taskRepository.findById(notExistentId))
                    .toBeNull();
            });
        });

        describe('getByStatusId', () => {
            it('should return only tasks that match the given status id', () => {
                const pending = createStatus('Pendiente');
                const completed = createStatus('Completed');

                const hacerLaCama = createTask(completed.id().value(), 'Hacer la cama');
                const limpiarElPolvo = createTask(completed.id().value(), 'Limpiar el polvo');
                const aspirar = createTask(pending.id().value(), 'aspirar');
                const mochar = createTask(pending.id().value(), 'mochar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(new StatusId(pending.id().value()))))
                    .toEqual([
                        aspirar,
                        mochar
                    ]);
            });

            it('should return an empty array when no statuses match the given name', () => {
                const pending = createStatus('Pendiente');
                const completed = createStatus('Completed');
                const cancelled = createStatus('Cancelled');

                const hacerLaCama = createTask(completed.id().value(), 'Hacer la cama');
                const limpiarElPolvo = createTask(completed.id().value(), 'Limpiar el polvo');
                const aspirar = createTask(pending.id().value(), 'aspirar');
                const mochar = createTask(pending.id().value(), 'mochar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(new StatusId(cancelled.id().value()))))
                    .toEqual([]);
            });

        });

        describe('getByFilters', () => {
            it('should return all tasks when no filters are provided', () => {
                const pending = createStatus('Pendiente');

                const hacerLaCama = createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = createTask(pending.id().value(), 'Recoger la ropa');

                expect(taskRepository.getByFilters(new GetTasksCriteria()))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given status id', () => {
                const pending = createStatus('Pendiente');
                const done = createStatus('Done');

                const hacerLaCama = createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = createTask(done.id().value(), 'Aspirar');
                const fregar = createTask(done.id().value(), 'Fregar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(pending.id())))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given title', () => {
                const pending = createStatus('Pendiente');
                const done = createStatus('Done');

                const hacerLaCama = createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = createTask(done.id().value(), 'Aspirar');
                const fregar = createTask(done.id().value(), 'Fregar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(undefined, new TaskTitle('la'))))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given status id and title', () => {
                const pending = createStatus('Pendiente');
                const done = createStatus('Done');

                const hacerLaCama = createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = createTask(done.id().value(), 'Aspirar');
                const fregar = createTask(done.id().value(), 'Fregar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(pending.id(), new TaskTitle('cama'))))
                    .toEqual([
                        hacerLaCama
                    ]);
            });


            it('should return an empty array when no tasks match the given status id', () => {
                const pending = createStatus('Pendiente');
                const done = createStatus('Done');

                const hacerLaCama = createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = createTask(pending.id().value(), 'Aspirar');
                const fregar = createTask(pending.id().value(), 'Fregar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(done.id())))
                    .toEqual([]);
            });

            it('should return an empty array when no tasks match the given title', () => {
                const pending = createStatus('Pendiente');

                const hacerLaCama = createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = createTask(pending.id().value(), 'Aspirar');
                const fregar = createTask(pending.id().value(), 'Fregar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(undefined, new TaskTitle('Cocina'))))
                    .toEqual([]);
            });

            it('should return an empty array when no tasks match the given status id and title', () => {
                const pending = createStatus('Pendiente');
                const done = createStatus('Done');

                const hacerLaCama = createTask(pending.id().value(), 'Hacer la cama');
                const recogerLaRopa = createTask(pending.id().value(), 'Recoger la ropa');
                const aspirar = createTask(pending.id().value(), 'Aspirar');
                const fregar = createTask(done.id().value(), 'Fregar');

                expect(taskRepository.getByFilters(new GetTasksCriteria(done.id(), new TaskTitle('tenedor'))))
                    .toEqual([]);
            });
        });
    });

    function createStatus(name: string): Status {
        const status = new Status(new StatusId, new StatusName(name));
        statusRepository.create(status);
        return status;
    }

    function createTask(statusId: string, name: string): Task {
        const task = new Task(new TaskId, new StatusId(statusId), new TaskTitle('Hacer la cama'));
        taskRepository.create(task);
        return task;
    }


}