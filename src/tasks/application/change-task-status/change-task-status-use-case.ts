import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { ChangeTaskStatusCommand } from "./change-task-status-command";
import { TaskId } from "../../domain/value-objects/task-id/task-id";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { EnsureTaskExistsById } from "../../domain/services/ensure-task-exists-by-id";
import { TaskRepository } from "../../domain/repositories/task-repository";
import { ChangeTaskStatusResult } from "./change-task-status-result";
import { ChangeTaskStatusMapper } from "./change-task-status-mapper";

export class ChangeTaskStatusUseCase {

    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly ensureTaskExistsById: EnsureTaskExistsById,
        private readonly ensureStatusExistsById: EnsureStatusExistsById,
    ) { }

    async execute(command: ChangeTaskStatusCommand): Promise<ChangeTaskStatusResult> {
        const taskId = new TaskId(command.taskId);
        const statusId = new StatusId(command.statusId);

        const task = await this.ensureTaskExistsById.execute(taskId);
        await this.ensureStatusExistsById.execute(statusId);

        task.changeStatus(statusId);

        await this.taskRepository.update(task);

        return ChangeTaskStatusMapper.toResult(task);
    }

}