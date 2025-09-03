import { Status } from "../../../statuses/domain/status";
import { GetStatusesResult } from "./get-statuses-result";

export class GetStatusesMapper {

    static toResult(status: Status): GetStatusesResult {
        return new GetStatusesResult(status.id().value(), status.name().value());
    }

    static toResults(statuses: Status[]): GetStatusesResult[] {
        let statusesResult: GetStatusesResult[] = [];

        for (const status of statuses) {
            statusesResult.push(GetStatusesMapper.toResult(status));
        }

        return statusesResult;
    }

}