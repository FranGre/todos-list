import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { GetTasksCriteria } from "../criteria/get-tasks-criteria";
import { Task } from "../task";
import { TaskId } from "../value-objects/task-id/task-id";

export interface TaskRepository {

    create(task: Task): Promise<void>;

    findById(taskId: TaskId): Promise<Task | null>;

    remove(taskId: TaskId): Promise<void>;

    update(task: Task): Promise<void>;

    getByStatusId(statusId: StatusId): Promise<Task[]>;

    getByFilters(criteria: GetTasksCriteria): Promise<Task[]>;

}