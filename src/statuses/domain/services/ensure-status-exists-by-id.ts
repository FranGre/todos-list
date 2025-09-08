import { StatusNotFoundByIdError } from "../errors/status-not-found-by-id-error";
import { Status } from "../status";
import { StatusRepository } from "../repositories/status-repository";
import { StatusId } from "../value-objects/status-id/status-id";

export class EnsureStatusExistsById {

    constructor(private readonly statusRepository: StatusRepository) { }

    async execute(statusId: StatusId): Promise<Status> {
        const status = await this.statusRepository.findById(statusId);
        if (!status) {
            throw new StatusNotFoundByIdError(statusId.value());
        }

        return status
    }

}