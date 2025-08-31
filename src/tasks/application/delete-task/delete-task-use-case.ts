import { TaskId } from "../../domain/value-objects/task-id/task-id";
import { TaskRepository } from "../../domain/task-repository";
import { DeleteTaskCommand } from "./delete-task-command";
import { EnsureTaskExistsById } from "src/tasks/domain/services/ensure-task-exists-by-id";
import { DeleteTaskResult } from "./delete-task-result";
import { DeleteTaskMapper } from "./delete-task-mapper";

export class DeleteTaskUseCase {

    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly ensureTaskExistsById: EnsureTaskExistsById
    ) {}

    execute(command: DeleteTaskCommand): DeleteTaskResult {
        const taskId = new TaskId(command.id);

        const task = this.ensureTaskExistsById.execute(taskId);

        this.taskRepository.remove(taskId);

        return DeleteTaskMapper.toResult(task);
    }

}