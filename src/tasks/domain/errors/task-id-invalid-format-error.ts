export class TaskIdInvalidFormatError extends Error {

    constructor() {
        super('TaskId has not a valid uuid format');
        this.name = 'TaskIdInvalidFormatError';
    }

}