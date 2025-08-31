import { Task } from "src/tasks/domain/task";
import { DeleteTaskResult } from "./delete-task-result";

export class DeleteTaskMapper {

    static toResult(task: Task) {
        return new DeleteTaskResult(task.id().value());
    }

}