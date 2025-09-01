import { Task } from "../../../tasks/domain/task";
import { ChangeTaskStatusResult } from "./change-task-status-result";

export class ChangeTaskStatusMapper {

    static toResult(task: Task): ChangeTaskStatusResult {
        return new ChangeTaskStatusResult(task.id().value(), task.statusId().value(), task.title().value());
    }

}