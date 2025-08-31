export class TaskTitleEmptyError extends Error {

    constructor() {
        super('TaskTitle cannot be empty');
        this.name = 'TaskTitleEmptyError';
    }

}