import { StatusNotFoundByIdError } from "../errors/status-not-found-by-id-error";
import { StatusRepository } from "../status-repository";
import { StatusId } from "../value-objects/status-id/status-id";

export class EnsureStatusExistsById {

    constructor(private readonly statusRepository: StatusRepository) {}

    execute(statusId: StatusId): void {
        if (!this.statusRepository.findById(statusId)) {
            throw new StatusNotFoundByIdError(statusId.value());
        }
    }

}