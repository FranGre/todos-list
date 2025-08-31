import { TaskRepository } from "../../domain/task-repository";
import { Task } from "../../domain/task";
import { TaskId } from "../../domain/value-objects/task-id/task-id";

export class InMemoryTaskRepository implements TaskRepository {
    public tasks: Task[] = [];

    create(task: Task): void {
        this.tasks.push(task);
    }

    findById(taskId: TaskId): Task | null {
         for (const task of this.tasks) {
            if (task.id().value() == taskId.value()) {
                return task;
            }
        }

        return null;
    }

    remove(taskId: TaskId): void {
        this.tasks = this.tasks.filter((task) => task.id().value() != taskId.value());
    }

}