import { StatusId } from "../../domain/value-objects/status-id/status-id";
import { CreateStatusCommand } from "./create-status-command";
import { StatusName } from "../../domain/value-objects/status-name/status-name";
import { CreateStatusResult } from "./create-status-result";
import { CreateStatusMapper } from "./create-status-mapper";
import { Status } from "../../domain/status";
import { StatusRepository } from "../../domain/repositories/status-repository";
import { StatusNameAlreadyExistsError } from "../../domain/errors/status-name-already-exists-error";
import { Inject } from "@nestjs/common";

export class CreateStatusUseCase {

    constructor(@Inject(StatusRepository) private statusRepository: StatusRepository) { }

    async execute(command: CreateStatusCommand): Promise<CreateStatusResult> {
        const statusId = new StatusId();
        const statusName = new StatusName(command.name);

        if (await this.statusRepository.findByName(statusName)) {
            throw new StatusNameAlreadyExistsError(statusName.value());
        }

        const status = new Status(statusId, statusName);

        this.statusRepository.create(status);

        return CreateStatusMapper.toResult(status);
    }

}