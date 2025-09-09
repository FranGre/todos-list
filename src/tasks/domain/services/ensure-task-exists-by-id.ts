import { TaskNotFoundByIdError } from "../errors/task-not-found-by-id-error";
import { Task } from "../task";
import { TaskRepository } from "../repositories/task-repository";
import { TaskId } from "../value-objects/task-id/task-id";

export class EnsureTaskExistsById {

    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(taskId: TaskId): Promise<Task> {
        const task = await this.taskRepository.findById(taskId)

        if (!task) {
            throw new TaskNotFoundByIdError(taskId.value());
        }

        return task;
    }

}