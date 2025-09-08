import { GetStatusesCriteria } from "../../../statuses/application/get-statuses/get-statuses-criteria";
import { Status } from "../status";
import { StatusId } from "../value-objects/status-id/status-id";
import { StatusName } from "../value-objects/status-name/status-name";
import { StatusRepository } from "./status-repository";

export function executeStatusRepositoryTests(repoFactory: () => StatusRepository) {
    let statusRepository: StatusRepository;

    beforeEach(() => {
        statusRepository = repoFactory();
    });

    describe('create', () => {
        it('should store a status', async () => {
            const status = await createStatus('Pendiente');

            expect(await statusRepository.findById(status.id()))
                .toEqual(new Status(status.id(), status.name()));
        });
    });

    describe('findById', () => {
        it('should return the status when it exists', async () => {
            const status = await createStatus('Pendiente');

            expect(await statusRepository.findById(status.id()))
                .toEqual(status);
        });

        it('should return null when it does not exist', async () => {
            const notExistentId = new StatusId();

            expect(await statusRepository.findById(notExistentId))
                .toBeNull();
        });
    });

    describe('findByName', () => {
        it('should return the status when it exists', async () => {
            const status = await createStatus('Pendiente');

            expect(await statusRepository.findByName(status.name()))
                .toEqual(new Status(status.id(), status.name()));
        });

        it('should return null when it does not exist', async () => {
            const notExistentName = new StatusName('pendiente');

            expect(await statusRepository.findByName(notExistentName))
                .toBeNull();
        });
    });

    describe('remove', () => {
        it('should remove a status when it exists', async () => {
            const status = await createStatus('Pendiente');
            await statusRepository.remove(status.id());

            expect(await statusRepository.findById(status.id()))
                .toBeNull();
        });

        it('should do nothing when status does not exist', async () => {
            const notExistentId = new StatusId();

            await statusRepository.remove(notExistentId);

            expect(await statusRepository.findById(notExistentId))
                .toBeNull();
        });
    });

    describe('getByFilters', () => {
        it('should return all statuses when no filters are provided', async () => {
            const pending = await createStatus('Pendiente');
            const inProgress = await createStatus('In progress');
            const done = await createStatus('Done');

            expect(await statusRepository.getByFilters(new GetStatusesCriteria()))
                .toEqual([
                    pending,
                    inProgress,
                    done
                ]);
        });

        it('should return only statuses that match the given name', async () => {
            await createStatus('Pending');
            await createStatus('In progress');
            const completed = await createStatus('Completed');
            const canceled = await createStatus('Canceled');

            expect(await statusRepository.getByFilters(new GetStatusesCriteria(new StatusName('ed'))))
                .toEqual([
                    completed,
                    canceled
                ]);
        });

        it('should return an empty array when no statuses match the given name', async () => {
            await createStatus('Pending');
            await createStatus('In progress');
            await createStatus('Completed');
            await createStatus('Canceled');

            expect(await statusRepository.getByFilters(new GetStatusesCriteria(new StatusName('Seller'))))
                .toEqual([]);
        });
    });

    async function createStatus(name: string): Promise<Status> {
        const status = new Status(new StatusId, new StatusName(name));
        await statusRepository.create(status);
        return status;
    }
}