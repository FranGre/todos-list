import { TaskRepository } from "../../domain/task-repository";
import { Task } from "../../domain/task";
import { TaskId } from "../../domain/value-objects/task-id/task-id";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";

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

    update(task: Task): void {
        let newTasks: Task[] = [];

        for (const element of this.tasks) {
            if (element.id().value() == task.id().value()) {
                newTasks.push(task);
                continue;
            }
            newTasks.push(element);
        }
    }

    getByStatusId(statusId: StatusId): Task[] {
        let tasks: Task[] = [];

        for (const task of this.tasks) {
            if (task.statusId().value() == statusId.value()) {
                tasks.push(task);
            }
        }

        return tasks;
    }

}