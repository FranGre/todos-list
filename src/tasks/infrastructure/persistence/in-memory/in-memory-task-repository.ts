import { TaskRepository } from "../../../domain/repositories/task-repository";
import { Task } from "../../../domain/task";
import { TaskId } from "../../../domain/value-objects/task-id/task-id";
import { StatusId } from "../../../../statuses/domain/value-objects/status-id/status-id";
import { GetTasksCriteria } from "src/tasks/domain/criteria/get-tasks-criteria";

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

    getByFilters(criteria: GetTasksCriteria): Task[] {
        let tasks: Task[] = [];

        const hasStatusId = criteria.statusId !== undefined;
        const hasTitle = criteria.title !== undefined;
        

        for (const task of this.tasks) {
            if (!hasStatusId && !hasTitle) {
                tasks.push(task);
                continue;
            }

            // Caso 2: Solo statusId
            if (hasStatusId && !hasTitle) {
                if (task.statusId().value() === criteria.statusId.value()) {
                    tasks.push(task);
                }
                continue;
            }

            // Caso 3: Solo title
            if (!hasStatusId && hasTitle) {
                if (task.title().value().includes(criteria.title.value())) {
                    tasks.push(task);
                }
                continue;
            }

            // Caso 4: Ambos criterios
            if (hasStatusId && hasTitle) {
                if (task.statusId().value() === criteria.statusId.value()
                    && task.title().value().includes(criteria.title.value())) {
                    tasks.push(task);
                }
            }
        }

        return tasks;
    }

}