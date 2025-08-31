import { Task } from "src/tasks/domain/task";
import { CreateTaskResult } from "./create-task-result";

export class CreateTaskMapper {

    static toResult(task: Task): CreateTaskResult {
        return new CreateTaskResult(task.id().value(), task.statusId().value(), task.title().value());
    }

}