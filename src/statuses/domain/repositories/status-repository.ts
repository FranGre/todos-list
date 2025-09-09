import { GetStatusesCriteria } from "../../application/get-statuses/get-statuses-criteria";
import { Status } from "../status";
import { StatusId } from "../value-objects/status-id/status-id";
import { StatusName } from "../value-objects/status-name/status-name";

export abstract class StatusRepository {

    abstract create(status: Status): Promise<void>;

    abstract findById(statusId: StatusId): Promise<Status | null>;

    abstract findByName(statusName: StatusName): Promise<Status | null>;

    abstract remove(statusId: StatusId): Promise<void>;

    abstract getByFilters(criteria: GetStatusesCriteria): Promise<Status[]>;

}