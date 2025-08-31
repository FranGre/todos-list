export class TaskNotFoundByIdError extends Error {

    constructor(id: string) {
        super(`Task with id '${id}' was not found`);
        this.name = 'TaskNotFoundByIdError';
    }

}