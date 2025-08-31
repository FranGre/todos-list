export class TaskNameEmptyError extends Error {

    constructor() {
        super('TaskName cannot be empty');
        this.name = 'TaskNameEmptyError';
    }

}