import { Task } from "./task";
import { TaskId } from "./value-objects/task-id/task-id";

export interface TaskRepository {

    create(task: Task): void;

    findById(taskId: TaskId): Task | null;

    remove(taskId: TaskId): void;

}