import { Task } from "../../../tasks/domain/task";
import { GetTaskResult } from "./get-task-result";

export class GetTaskMapper {

    static toResult(task: Task): GetTaskResult {
        return new GetTaskResult(task.id().value(), task.statusId().value(), task.title().value());
    }

}