import { Task } from "../../domain/task";
import { GetTasksResult } from "./get-tasks-result";

export class GetTasksMapper {

    static toResult(task: Task): GetTasksResult {
        return new GetTasksResult(task.id().value(), task.statusId().value(), task.title().value());
    }

    static toResults(tasks: Task[]): GetTasksResult[] {
        let results: GetTasksResult[] = [];

        for (const element of tasks) {
            results.push(GetTasksMapper.toResult(element));
        }

        return results;
    }

}