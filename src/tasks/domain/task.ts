import { StatusId } from "src/statuses/domain/value-objects/status-id/status-id";
import { TaskId } from "./value-objects/task-id/task-id";
import { TaskTitle } from "./value-objects/task-title/task-title";

export class Task {

    constructor(private _id: TaskId, private _statusId: StatusId, private _title: TaskTitle) {}

    id(): TaskId {
        return this._id;
    }

    statusId(): StatusId {
        return this._statusId;
    }

    title(): TaskTitle {
        return this._title;
    }

}