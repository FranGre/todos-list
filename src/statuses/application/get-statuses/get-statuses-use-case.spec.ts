import { StatusRepository } from "../../domain/repositories/status-repository";
import { CreateStatusUseCase } from "../create-status/create-status-use-case";
import { InMemoryStatusRepository } from "../../infrastructure/persistence/in-memory/in-memory-status-repository";
import { CreateStatusResult } from "../create-status/create-status-result";
import { CreateStatusCommand } from "../create-status/create-status-command";
import { GetStatusesQuery } from "./get-statuses-query";
import { GetStatusesResult } from "./get-statuses-result";
import { GetStatusesUseCase } from "./get-statuses-use-case";

describe('GetStatusesUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;
    let getStatusesUseCase: GetStatusesUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);
        getStatusesUseCase = new GetStatusesUseCase(statusRepository);
    });

    describe('filters', () => {
        it('should return all status', async () => {
            const pendingStatus = await createStatus('Pendiente');
            const inProgressStatus = await createStatus('En progreso');
            const doneStatus = await createStatus('Realizado');
            const inRevissionStatus = await createStatus('Revisión');

            expect(await getStatuses())
                .toEqual(
                    [
                        {
                            id: pendingStatus.id,
                            name: pendingStatus.name
                        },
                        {
                            id: inProgressStatus.id,
                            name: inProgressStatus.name
                        },
                        {
                            id: doneStatus.id,
                            name: doneStatus.name
                        },
                        {
                            id: inRevissionStatus.id,
                            name: inRevissionStatus.name
                        }
                    ]
                );
        });

        it('should return statuses when filtered by name', async () => {
            const pendingStatus = await createStatus('Pendiente');
            const inProgressStatus = await createStatus('En progreso');
            const doneStatus = await createStatus('Realizado');
            const inRevissionStatus = await createStatus('En Revisión');

            expect(await getStatuses('en'))
                .toEqual(
                    [
                        {
                            id: pendingStatus.id,
                            name: pendingStatus.name
                        },
                        {
                            id: inProgressStatus.id,
                            name: inProgressStatus.name
                        },
                        {
                            id: inRevissionStatus.id,
                            name: inRevissionStatus.name
                        }
                    ]
                );
        });

        it('should return an empty array when no status name matches', async () => {
            await createStatus('Pendiente');
            await createStatus('En progreso');
            await createStatus('Realizado');
            await createStatus('Revisión');

            const notMatchesName = 'jugar';

            expect(await getStatuses(notMatchesName))
                .toEqual([]);
        });
    });

    async function createStatus(name: string): Promise<CreateStatusResult> {
        return await createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    async function getStatuses(name?: string): Promise<GetStatusesResult[]> {
        return await getStatusesUseCase.execute(new GetStatusesQuery(name));
    }
});