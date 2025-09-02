import { Status } from "../../../statuses/domain/status";
import { DeleteStatusResult } from "./delete-status-result";

export class DeleteStatusMapper {

    static toResult(status: Status): DeleteStatusResult {
        return new DeleteStatusResult(status.id().value());
    }

}