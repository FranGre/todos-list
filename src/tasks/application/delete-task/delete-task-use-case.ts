import { TaskId } from "../../domain/value-objects/task-id/task-id";
import { TaskRepository } from "../../domain/repositories/task-repository";
import { DeleteTaskCommand } from "./delete-task-command";
import { EnsureTaskExistsById } from "src/tasks/domain/services/ensure-task-exists-by-id";
import { DeleteTaskResult } from "./delete-task-result";
import { DeleteTaskMapper } from "./delete-task-mapper";

export class DeleteTaskUseCase {

    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly ensureTaskExistsById: EnsureTaskExistsById
    ) {}

    async execute(command: DeleteTaskCommand): Promise<DeleteTaskResult> {
        const taskId = new TaskId(command.id);

        const task = await this.ensureTaskExistsById.execute(taskId);

        await this.taskRepository.remove(taskId);

        return DeleteTaskMapper.toResult(task);
    }

}