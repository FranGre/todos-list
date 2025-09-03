import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { GetStatusQuery } from "./get-status-query";
import { GetStatusResult } from "./get-status-result";
import { GetStatusMapper } from "./get-status-mapper";

export class GetStatusUseCase {

    constructor(private readonly ensureStatusExistsById: EnsureStatusExistsById) { }

    execute(query: GetStatusQuery): GetStatusResult {
        const statusId = new StatusId(query.id);

        const status = this.ensureStatusExistsById.execute(statusId);

        return GetStatusMapper.toResult(status);
    }

}