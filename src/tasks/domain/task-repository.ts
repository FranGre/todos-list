import { StatusId } from "../../statuses/domain/value-objects/status-id/status-id";
import { Task } from "./task";
import { TaskId } from "./value-objects/task-id/task-id";

export interface TaskRepository {

    create(task: Task): void;

    findById(taskId: TaskId): Task | null;

    remove(taskId: TaskId): void;

    update(task: Task): void;

    getByStatusId(statusId: StatusId): Task[];

}