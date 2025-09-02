import { Status } from "./status";
import { StatusId } from "./value-objects/status-id/status-id";
import { StatusName } from "./value-objects/status-name/status-name";

export interface StatusRepository {

    create(status: Status): void;

    findById(statusId: StatusId): Status | null;

    findByName(statusName: StatusName): Status | null;

    remove(statusId: StatusId): void;

}