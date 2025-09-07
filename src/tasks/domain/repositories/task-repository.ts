import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { GetTasksCriteria } from "../criteria/get-tasks-criteria";
import { Task } from "../task";
import { TaskId } from "../value-objects/task-id/task-id";

export interface TaskRepository {

    create(task: Task): void;

    findById(taskId: TaskId): Task | null;

    remove(taskId: TaskId): void;

    update(task: Task): void;

    getByStatusId(statusId: StatusId): Task[];

    getByFilters(criteria: GetTasksCriteria): Task[];

}