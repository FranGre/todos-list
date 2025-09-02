import { StatusHasAssociatedTasksError } from "../../../statuses/domain/errors/status-has-associated-tasks-error";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { Task } from "../task";
import { TaskRepository } from "../task-repository";

export class EnsureStatusHasNoAssociatedTasks {

    constructor(private readonly taskRepository: TaskRepository) { }

    execute(statusId: StatusId): void {
        const tasks = this.taskRepository.getByStatusId(statusId)

        if (tasks.length >= 1) {
            throw new StatusHasAssociatedTasksError(statusId.value());
        }

    }

}