import { EnsureTaskExistsById } from "../../../tasks/domain/services/ensure-task-exists-by-id";
import { GetTaskQuery } from "./get-task-query";
import { GetTaskResult } from "./get-task-result";
import { TaskId } from "../../domain/value-objects/task-id/task-id";
import { GetTaskMapper } from "./get-task-mapper";

export class GetTaskUseCase {

    constructor(private readonly ensureTaskExistsById: EnsureTaskExistsById) { }

    async execute(query: GetTaskQuery): Promise<GetTaskResult> {
        const taskId = new TaskId(query.id);

        const task = await this.ensureTaskExistsById.execute(taskId);

        return GetTaskMapper.toResult(task);
    }

}