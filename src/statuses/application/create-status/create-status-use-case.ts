import { StatusId } from "../../domain/value-objects/status-id/status-id";
import { CreateStatusCommand } from "./create-status-command";
import { StatusName } from "../../domain/value-objects/status-name/status-name";
import { CreateStatusResult } from "./create-status-result";
import { CreateStatusMapper } from "./create-status-mapper";
import { Status } from "../../domain/status";
import { StatusRepository } from "../../domain/status-repository";
import { StatusNameAlreadyExistsError } from "../../domain/errors/status-name-already-exists-error";

export class CreateStatusUseCase {

    constructor(private statusRepository: StatusRepository) {}

    execute(command: CreateStatusCommand): CreateStatusResult {
        const statusId = new StatusId();
        const statusName = new StatusName(command.name);

        if (this.statusRepository.findByName(statusName)) {
            throw new StatusNameAlreadyExistsError(statusName.value());
        }
        
        const status = new Status(statusId, statusName);

        this.statusRepository.create(status);

        return CreateStatusMapper.toResult(status);
    }

}