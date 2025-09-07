import { StatusRepository } from "../../domain/repositories/status-repository";
import { InMemoryStatusRepository } from "../../infrastructure/persistence/in-memory/in-memory-status-repository";
import { EnsureStatusExistsById } from "../../domain/services/ensure-status-exists-by-id";
import { StatusNotFoundByIdError } from "../../../statuses/domain/errors/status-not-found-by-id-error";
import { CreateStatusResult } from "../create-status/create-status-result";
import { CreateStatusCommand } from "../create-status/create-status-command";
import { CreateStatusUseCase } from "../create-status/create-status-use-case";
import { GetStatusQuery } from "./get-status-query";
import { GetStatusResult } from "./get-status-result";
import { GetStatusUseCase } from "./get-status-use-case";

describe('GetStatusUseCase', () => {
    let statusRepository: StatusRepository;
    let createStatusUseCase: CreateStatusUseCase;
    let getStatusUseCase: GetStatusUseCase;

    beforeEach(() => {
        statusRepository = new InMemoryStatusRepository();
        createStatusUseCase = new CreateStatusUseCase(statusRepository);
        getStatusUseCase = new GetStatusUseCase(new EnsureStatusExistsById(statusRepository));
    });

    it('should return a status when status exists', () => {
        const status = createStatus('Pendiente');

        expect(getStatus(status.id))
            .toEqual({
                id: status.id,
                name: status.name
            });
    });

    describe('errors', () => {
        it('should throw an error when status does not exists', () => {
            const nonExistentStatusId = 'b278bf16-7673-4e0e-b163-19e9d90fbd3b';
            expect(() => getStatus(nonExistentStatusId))
                .toThrow(StatusNotFoundByIdError);
        });
    });

    function createStatus(name: string): CreateStatusResult {
        return createStatusUseCase.execute(new CreateStatusCommand(name));
    }

    function getStatus(id: string): GetStatusResult {
        return getStatusUseCase.execute(new GetStatusQuery(id));
    }
});