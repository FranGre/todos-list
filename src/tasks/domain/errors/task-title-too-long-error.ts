import { TaskTitle } from "../value-objects/task-title/task-title";

export class TaskTitleTooLongError extends Error {

    constructor() {
        super(`TaskTitle has exceeded the maximum length (${TaskTitle.MAX_LENGTH})`);
        this.name = 'TaskTitleTooLongError';
    }

}