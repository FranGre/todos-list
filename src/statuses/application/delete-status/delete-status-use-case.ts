import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { StatusRepository } from "../../domain/repositories/status-repository";
import { DeleteStatusCommand } from "./delete-status-command";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { DeleteStatusResult } from "./delete-status-result";
import { DeleteStatusMapper } from "./delete-status-mapper";
import { EnsureStatusHasNoAssociatedTasks } from "../../../tasks/domain/services/ensure-status-has-no-associated-tasks";

export class DeleteStatusUseCase {

    constructor(
        private readonly statusRepository: StatusRepository,
        private readonly ensureStatusExistsById: EnsureStatusExistsById,
        private readonly ensureStatusHasNoAssociatedTasks: EnsureStatusHasNoAssociatedTasks
    ) { }

    async execute(command: DeleteStatusCommand): Promise<DeleteStatusResult> {
        const statusId = new StatusId(command.id);

        const status = await this.ensureStatusExistsById.execute(statusId);
        await this.ensureStatusHasNoAssociatedTasks.execute(statusId);

        await this.statusRepository.remove(status.id());

        return DeleteStatusMapper.toResult(status);
    }

}