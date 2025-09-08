import { GetStatusesCriteria } from "../../application/get-statuses/get-statuses-criteria";
import { Status } from "../status";
import { StatusId } from "../value-objects/status-id/status-id";
import { StatusName } from "../value-objects/status-name/status-name";

export interface StatusRepository {

    create(status: Status): Promise<void>;

    findById(statusId: StatusId): Promise<Status | null>;

    findByName(statusName: StatusName): Promise<Status | null>;

    remove(statusId: StatusId): Promise<void>;

    getByFilters(criteria: GetStatusesCriteria): Promise<Status[]>;

}