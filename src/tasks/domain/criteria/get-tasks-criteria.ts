import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { TaskTitle } from "../value-objects/task-title/task-title";

export class GetTasksCriteria {

    constructor(public readonly statusId?: StatusId, public readonly title?: TaskTitle) { }

}