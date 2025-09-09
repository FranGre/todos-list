import { StatusHasAssociatedTasksError } from "../../../statuses/domain/errors/status-has-associated-tasks-error";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { Task } from "../task";
import { TaskRepository } from "../repositories/task-repository";

export class EnsureStatusHasNoAssociatedTasks {

    constructor(private readonly taskRepository: TaskRepository) { }

    async execute(statusId: StatusId): Promise<void> {
        const tasks = await this.taskRepository.getByStatusId(statusId)

        if (tasks.length >= 1) {
            throw new StatusHasAssociatedTasksError(statusId.value());
        }

    }

}