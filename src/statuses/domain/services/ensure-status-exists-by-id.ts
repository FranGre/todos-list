import { StatusNotFoundByIdError } from "../errors/status-not-found-by-id-error";
import { Status } from "../status";
import { StatusRepository } from "../status-repository";
import { StatusId } from "../value-objects/status-id/status-id";

export class EnsureStatusExistsById {

    constructor(private readonly statusRepository: StatusRepository) { }

    execute(statusId: StatusId): Status {
        const status = this.statusRepository.findById(statusId);
        if (!status) {
            throw new StatusNotFoundByIdError(statusId.value());
        }

        return status
    }

}