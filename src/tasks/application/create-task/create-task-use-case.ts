import { CreateTaskCommand } from "./create-task-command";
import { TaskTitle } from "../../domain/value-objects/task-title/task-title";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { CreateTaskResult } from "./create-task-result";
import { EnsureStatusExistsById } from "../../../statuses/domain/services/ensure-status-exists-by-id";
import { Task } from "../../domain/task";
import { TaskId } from "../../domain/value-objects/task-id/task-id";
import { CreateTaskMapper } from "./create-task-mapper";
import { TaskRepository } from "../../domain/repositories/task-repository";

export class CreateTaskUseCase {

    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly ensureStatusExistsById: EnsureStatusExistsById
    ) {}

    execute(command: CreateTaskCommand): CreateTaskResult {
        const taskId = new TaskId();
        const taskTitle = new TaskTitle(command.title);
        const statusId = new StatusId(command.statusId);

        this.ensureStatusExistsById.execute(statusId);

        const task = new Task(taskId, statusId, taskTitle);

        this.taskRepository.create(task);

        return CreateTaskMapper.toResult(task);
    }

}