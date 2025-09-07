import { TaskRepository } from "../../../tasks/domain/repositories/task-repository";
import { GetTasksQuery } from "./get-tasks-query";
import { GetTasksResult } from "./get-tasks-result";
import { GetTasksMapper } from "./get-tasks-mapper";
import { Task } from "../../../tasks/domain/task";
import { GetTasksCriteria } from "../../../tasks/domain/criteria/get-tasks-criteria";
import { StatusId } from "../../../statuses/domain/value-objects/status-id/status-id";
import { TaskTitle } from "../../../tasks/domain/value-objects/task-title/task-title";
import { EnsureStatusExistsById } from "src/statuses/domain/services/ensure-status-exists-by-id";

export class GetTasksUseCase {

    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly ensureStatusExistsById: EnsureStatusExistsById
    ) { }

    execute(query: GetTasksQuery): GetTasksResult[] {
        let statusId: StatusId | undefined;
        let taskTitle: TaskTitle | undefined;

        if (query.statusId) {
            statusId = new StatusId(query.statusId);
        }
        if (query.title) {
            taskTitle = new TaskTitle(query.title);
        }

        if (statusId) {
            this.ensureStatusExistsById.execute(statusId);
        }

        const tasks: Task[] = this.taskRepository.getByFilters(new GetTasksCriteria(statusId, taskTitle));

        return GetTasksMapper.toResults(tasks);
    }

}