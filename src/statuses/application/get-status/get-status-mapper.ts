import { Status } from "../../../statuses/domain/status";
import { GetStatusResult } from "./get-status-result";

export class GetStatusMapper {

    static toResult(status: Status): GetStatusResult {
        return new GetStatusResult(status.id().value(), status.name().value());
    }

}