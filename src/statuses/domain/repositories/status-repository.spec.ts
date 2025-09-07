import { GetStatusesCriteria } from "../../../statuses/application/get-statuses/get-statuses-criteria";
import { InMemoryStatusRepository } from "../../../statuses/infrastructure/persistence/in-memory/in-memory-status-repository";
import { Status } from "../status";
import { StatusId } from "../value-objects/status-id/status-id";
import { StatusName } from "../value-objects/status-name/status-name";
import { StatusRepository } from "./status-repository";

export function execute(statusRepository: StatusRepository) {
    describe('StatusRepository', () => {

        beforeEach(() => {
            statusRepository = new InMemoryStatusRepository();
        });

        describe('create', () => {
            it('should store a status', () => {
                const status = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(status);

                expect(statusRepository.findById(status.id()))
                    .toEqual(new Status(status.id(), status.name()));
            });
        });

        describe('findById', () => {
            it('should return the status when it exists', () => {
                const status = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(status);

                expect(statusRepository.findById(status.id()))
                    .toEqual(status);
            });

            it('should return null when it does not exist', () => {
                const notExistentId = new StatusId();

                expect(statusRepository.findById(notExistentId))
                    .toBeNull();
            });
        });

        describe('findByName', () => {
            it('should return the status when it exists', () => {
                const status = new Status(new StatusId(), new StatusName('Pendiente'));
                statusRepository.create(status);

                expect(statusRepository.findByName(status.name()))
                    .toEqual(new Status(status.id(), status.name()));
            });

            it('should return null when it does not exist', () => {
                const notExistentName = new StatusName('pendiente');

                expect(statusRepository.findByName(notExistentName))
                    .toBeNull();
            });
        });

        describe('remove', () => {
            it('should remove a status when it exists', () => {
                const status = new Status(new StatusId, new StatusName('Pendiente'));
                statusRepository.create(status);
                statusRepository.remove(status.id());

                expect(statusRepository.findById(status.id()))
                    .toBeNull();
            });

            it('should do nothing when status does not exist', () => {
                const notExistentId = new StatusId();

                statusRepository.remove(notExistentId);

                expect(statusRepository.findById(notExistentId))
                    .toBeNull();
            });
        });

        describe('getByFilters', () => {
            it('should return all statuses when no filters are provided', () => {
                const pending = new Status(new StatusId, new StatusName('Pendiente'));
                const inProgress = new Status(new StatusId, new StatusName('In progress'));
                const done = new Status(new StatusId, new StatusName('Done'));

                statusRepository.create(pending);
                statusRepository.create(inProgress);
                statusRepository.create(done);

                expect(statusRepository.getByFilters(new GetStatusesCriteria()))
                    .toEqual([
                        pending,
                        inProgress,
                        done
                    ]);
            });

            it('should return only statuses that match the given name', () => {
                const pending = new Status(new StatusId, new StatusName('Pending'));
                const inProgress = new Status(new StatusId, new StatusName('In progress'));
                const completed = new Status(new StatusId, new StatusName('Completed'));
                const canceled = new Status(new StatusId, new StatusName('Canceled'));

                statusRepository.create(pending);
                statusRepository.create(inProgress);
                statusRepository.create(completed);
                statusRepository.create(canceled);

                expect(statusRepository.getByFilters(new GetStatusesCriteria(new StatusName('ed'))))
                    .toEqual([
                        completed,
                        canceled
                    ]);
            });

            it('should return an empty array when no statuses match the given name', () => {
                const pending = new Status(new StatusId, new StatusName('Pending'));
                const inProgress = new Status(new StatusId, new StatusName('In progress'));
                const completed = new Status(new StatusId, new StatusName('Completed'));
                const canceled = new Status(new StatusId, new StatusName('Canceled'));

                statusRepository.create(pending);
                statusRepository.create(inProgress);
                statusRepository.create(completed);
                statusRepository.create(canceled);

                expect(statusRepository.getByFilters(new GetStatusesCriteria(new StatusName('Seller'))))
                    .toEqual([]);
            });
        });
    });
}