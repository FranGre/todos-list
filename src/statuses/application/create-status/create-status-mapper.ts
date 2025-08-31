import { Status } from "src/statuses/domain/status";
import { CreateStatusResult } from "./create-status-result";

export class CreateStatusMapper {

    static toResult(status: Status): CreateStatusResult {
        return new CreateStatusResult(status.id().value(), status.name().value());
    }

}