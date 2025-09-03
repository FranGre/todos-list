import { StatusRepository } from "../../domain/status-repository";
import { CreateStatusUseCase } from "../create-status/create-status-use-case";
import { InMemoryStatusRepository } from "../../infrastructure/persistence/in-memory-status-repository";
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
        it('should return all status', () => {
            const pendingStatus = createStatus('Pendiente');
            const inProgressStatus = createStatus('En progreso');
            const doneStatus = createStatus('Realizado');
            const inRevissionStatus = createStatus('Revisión');

            expect(getStatuses())
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

        it('should return statuses when filtered by name', () => {
            const pendingStatus = createStatus('Pendiente');
            const inProgressStatus = createStatus('En progreso');
            const doneStatus = createStatus('Realizado');
            const inRevissionStatus = createStatus('En Revisión');

            expect(getStatuses('en'))
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

        it('should return an empty array when no status name matches', () => {
            createStatus('Pendiente');
            createStatus('En progreso');
            createStatus('Realizado');
            createStatus('Revisión');

            const notMatchesName = 'jugar';

            expect(getStatuses(notMatchesName))
                .toEqual([]);
        });
    });

    function createStatus(name: string): CreateStatusResult {
        return createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    function getStatuses(name?: string): GetStatusesResult[] {
        return getStatusesUseCase.execute(new GetStatusesQuery(name));
    }
});