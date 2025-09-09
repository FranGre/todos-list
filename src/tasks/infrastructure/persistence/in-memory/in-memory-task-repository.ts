import { TaskRepository } from "../../../domain/repositories/task-repository";
import { Task } from "../../../domain/task";
import { TaskId } from "../../../domain/value-objects/task-id/task-id";
import { StatusId } from "../../../../statuses/domain/value-objects/status-id/status-id";
import { GetTasksCriteria } from "src/tasks/domain/criteria/get-tasks-criteria";

export class InMemoryTaskRepository implements TaskRepository {
    public tasks: Task[] = [];

    async create(task: Task): Promise<void> {
        this.tasks.push(task);
    }

    async findById(taskId: TaskId): Promise<Task | null> {
        for (const task of this.tasks) {
            if (task.id().value() == taskId.value()) {
                return task;
            }
        }

        return null;
    }

    async remove(taskId: TaskId): Promise<void> {
        this.tasks = this.tasks.filter((task) => task.id().value() != taskId.value());
    }

    async update(task: Task): Promise<void> {
        let newTasks: Task[] = [];

        for (const element of this.tasks) {
            if (element.id().value() == task.id().value()) {
                newTasks.push(task);
                continue;
            }
            newTasks.push(element);
        }
    }

    async getByStatusId(statusId: StatusId): Promise<Task[]> {
        let tasks: Task[] = [];

        for (const task of this.tasks) {
            if (task.statusId().value() == statusId.value()) {
                tasks.push(task);
            }
        }

        return tasks;
    }

    async getByFilters(criteria: GetTasksCriteria): Promise<Task[]> {
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