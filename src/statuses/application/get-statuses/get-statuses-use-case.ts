import { StatusName } from "../../../statuses/domain/value-objects/status-name/status-name";
import { StatusRepository } from "../../../statuses/domain/status-repository";
import { GetStatusesQuery } from "./get-statuses-query";
import { GetStatusesResult } from "./get-statuses-result";
import { Status } from "../../../statuses/domain/status";
import { GetStatusesMapper } from "./get-statuses-mapper";
import { GetStatusesCriteria } from "./get-statuses-criteria";

export class GetStatusesUseCase {

    constructor(private readonly statusRepository: StatusRepository) { }

    execute(query: GetStatusesQuery): GetStatusesResult[] {
        let statusName: StatusName | undefined;

        if (query.name) {
            statusName = new StatusName(query.name);
        }

        const statuses: Status[] = this.statusRepository.getByFilters(new GetStatusesCriteria(statusName));

        return GetStatusesMapper.toResults(statuses);
    }

}