import { GetStatusesCriteria } from "../../../../statuses/application/get-statuses/get-statuses-criteria";
import { Status } from "../../../domain/status";
import { StatusRepository } from "../../../domain/repositories/status-repository";
import { StatusId } from "../../../domain/value-objects/status-id/status-id";
import { StatusName } from "../../../domain/value-objects/status-name/status-name";

export class InMemoryStatusRepository implements StatusRepository {

    public statuses: Status[] = [];

    async create(status: Status): Promise<void> {
        this.statuses.push(status);
    }

    async findById(statusId: StatusId): Promise<Status | null> {
        for (const status of this.statuses) {
            if (status.id().value() == statusId.value()) {
                return status;
            }
        }

        return null;
    }

    async findByName(statusName: StatusName): Promise<Status | null> {
        for (const status of this.statuses) {
            if (status.name().value() == statusName.value()) {
                return status;
            }
        }

        return null;
    }

    async remove(statusId: StatusId): Promise<void> {
        this.statuses = this.statuses.filter((status) => status.id().value() != statusId.value());
    }

    async getByFilters(criteria: GetStatusesCriteria): Promise<Status[]> {
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