import { GetStatusesCriteria } from "../../../statuses/application/get-statuses/get-statuses-criteria";
import { Status } from "../../domain/status";
import { StatusRepository } from "../../domain/status-repository";
import { StatusId } from "../../domain/value-objects/status-id/status-id";
import { StatusName } from "../../domain/value-objects/status-name/status-name";

export class InMemoryStatusRepository implements StatusRepository {

    public statuses: Status[] = [];

    create(status: Status): void {
        this.statuses.push(status);
    }

    findById(statusId: StatusId): Status | null {
        for (const status of this.statuses) {
            if (status.id().value() == statusId.value()) {
                return status;
            }
        }

        return null;
    }

    findByName(statusName: StatusName): Status | null {
        for (const status of this.statuses) {
            if (status.name().value() == statusName.value()) {
                return status;
            }
        }

        return null;
    }

    remove(statusId: StatusId): void {
        this.statuses = this.statuses.filter((status) => status.id().value() != statusId.value());
    }

    getByFilters(criteria: GetStatusesCriteria): Status[] {
        let statuses: Status[] = [];

        const hasName = criteria.name !== undefined;

        for (const status of this.statuses) {
            if (!hasName) {
                statuses.push(status);
                continue;
            }

            if (status.name().value().toLowerCase().includes(criteria.name.value().toLowerCase())) {
                statuses.push(status);
            }
        }

        return statuses;
    }

}