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
                const status = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(status);

                const task = new Task(new TaskId, status.id(), new TaskTitle('Hacer la cama'));
                taskRepository.create(task);

                expect(taskRepository.findById(task.id()))
                    .toEqual(task);
            });
        });

        describe('findById', () => {
            it('should return the task when it exists', () => {
                const status = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(status);

                const task = new Task(new TaskId, status.id(), new TaskTitle('Hacer la cama'));
                taskRepository.create(task);

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
                const status = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(status);

                const task = new Task(new TaskId, status.id(), new TaskTitle('Hacer la cama'));
                taskRepository.create(task);

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
                const pending = new Status(new StatusId, new StatusName('Pending'));
                const completed = new Status(new StatusId, new StatusName('Completed'));
                statusRepository.create(pending);
                statusRepository.create(completed);

                const hacerLaCama = new Task(new TaskId, completed.id(), new TaskTitle('Hacer la cama'));
                const limpiarElPolvo = new Task(new TaskId, completed.id(), new TaskTitle('Limpiar el polvo'));
                const aspirar = new Task(new TaskId, pending.id(), new TaskTitle('aspirar'));
                const mochar = new Task(new TaskId, pending.id(), new TaskTitle('mochar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(limpiarElPolvo);
                taskRepository.create(aspirar);
                taskRepository.create(mochar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(new StatusId(pending.id().value()))))
                    .toEqual([
                        aspirar,
                        mochar
                    ]);
            });

            it('should return an empty array when no statuses match the given name', () => {
                const pending = new Status(new StatusId, new StatusName('Pending'));
                const completed = new Status(new StatusId, new StatusName('Completed'));
                const cancelled = new Status(new StatusId, new StatusName('Cancelled'));
                statusRepository.create(pending);
                statusRepository.create(completed);

                const hacerLaCama = new Task(new TaskId, completed.id(), new TaskTitle('Hacer la cama'));
                const limpiarElPolvo = new Task(new TaskId, completed.id(), new TaskTitle('Limpiar el polvo'));
                const aspirar = new Task(new TaskId, pending.id(), new TaskTitle('aspirar'));
                const mochar = new Task(new TaskId, pending.id(), new TaskTitle('mochar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(limpiarElPolvo);
                taskRepository.create(aspirar);
                taskRepository.create(mochar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(new StatusId(cancelled.id().value()))))
                    .toEqual([]);
            });

        });

        describe('getByFilters', () => {
            it('should return all tasks when no filters are provided', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(pending);

                const hacerLaCama = new Task(new TaskId, pending.id(), new TaskTitle('Hacer la cama'));
                const recogerLaRopa = new Task(new TaskId, pending.id(), new TaskTitle('Recoger la ropa'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(recogerLaRopa);

                expect(taskRepository.getByFilters(new GetTasksCriteria()))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given status id', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                const done = new Status(new StatusId, new StatusName('Done'));
                statusRepository.create(pending);
                statusRepository.create(done);

                const hacerLaCama = new Task(new TaskId, pending.id(), new TaskTitle('Hacer la cama'));
                const recogerLaRopa = new Task(new TaskId, pending.id(), new TaskTitle('Recoger la ropa'));
                const aspirar = new Task(new TaskId, done.id(), new TaskTitle('Aspirar'));
                const fregar = new Task(new TaskId, done.id(), new TaskTitle('Fregar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(recogerLaRopa);
                taskRepository.create(aspirar);
                taskRepository.create(fregar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(pending.id())))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given title', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                const done = new Status(new StatusId, new StatusName('Done'));
                statusRepository.create(pending);
                statusRepository.create(done);

                const hacerLaCama = new Task(new TaskId, pending.id(), new TaskTitle('Hacer la cama'));
                const recogerLaRopa = new Task(new TaskId, pending.id(), new TaskTitle('Recoger la ropa'));
                const aspirar = new Task(new TaskId, done.id(), new TaskTitle('Aspirar'));
                const fregar = new Task(new TaskId, done.id(), new TaskTitle('Fregar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(recogerLaRopa);
                taskRepository.create(aspirar);
                taskRepository.create(fregar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(undefined, new TaskTitle('la'))))
                    .toEqual([
                        hacerLaCama,
                        recogerLaRopa
                    ]);
            });

            it('should return only tasks that match the given status id and title', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                const done = new Status(new StatusId, new StatusName('Done'));
                statusRepository.create(pending);
                statusRepository.create(done);

                const hacerLaCama = new Task(new TaskId, pending.id(), new TaskTitle('Hacer la cama'));
                const recogerLaRopa = new Task(new TaskId, pending.id(), new TaskTitle('Recoger la ropa'));
                const aspirar = new Task(new TaskId, done.id(), new TaskTitle('Aspirar'));
                const fregar = new Task(new TaskId, done.id(), new TaskTitle('Fregar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(recogerLaRopa);
                taskRepository.create(aspirar);
                taskRepository.create(fregar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(pending.id(), new TaskTitle('cama'))))
                    .toEqual([
                        hacerLaCama
                    ]);
            });


            it('should return an empty array when no tasks match the given status id', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                const done = new Status(new StatusId, new StatusName('Done'));
                statusRepository.create(pending);
                statusRepository.create(done);

                const hacerLaCama = new Task(new TaskId, pending.id(), new TaskTitle('Hacer la cama'));
                const recogerLaRopa = new Task(new TaskId, pending.id(), new TaskTitle('Recoger la ropa'));
                const aspirar = new Task(new TaskId, pending.id(), new TaskTitle('Aspirar'));
                const fregar = new Task(new TaskId, pending.id(), new TaskTitle('Fregar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(recogerLaRopa);
                taskRepository.create(aspirar);
                taskRepository.create(fregar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(done.id())))
                    .toEqual([]);
            });

            it('should return an empty array when no tasks match the given title', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(pending);

                const hacerLaCama = new Task(new TaskId, pending.id(), new TaskTitle('Hacer la cama'));
                const recogerLaRopa = new Task(new TaskId, pending.id(), new TaskTitle('Recoger la ropa'));
                const aspirar = new Task(new TaskId, pending.id(), new TaskTitle('Aspirar'));
                const fregar = new Task(new TaskId, pending.id(), new TaskTitle('Fregar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(recogerLaRopa);
                taskRepository.create(aspirar);
                taskRepository.create(fregar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(undefined, new TaskTitle('Cocina'))))
                    .toEqual([]);
            });

            it('should return an empty array when no tasks match the given status id and title', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                const done = new Status(new StatusId, new StatusName('Done'));
                statusRepository.create(pending);
                statusRepository.create(done);

                const hacerLaCama = new Task(new TaskId, pending.id(), new TaskTitle('Hacer la cama'));
                const recogerLaRopa = new Task(new TaskId, pending.id(), new TaskTitle('Recoger la ropa'));
                const aspirar = new Task(new TaskId, pending.id(), new TaskTitle('Aspirar'));
                const fregar = new Task(new TaskId, done.id(), new TaskTitle('Fregar'));
                taskRepository.create(hacerLaCama);
                taskRepository.create(recogerLaRopa);
                taskRepository.create(aspirar);
                taskRepository.create(fregar);

                expect(taskRepository.getByFilters(new GetTasksCriteria(done.id(), new TaskTitle('tenedor'))))
                    .toEqual([]);
            });
        });
    });
}