export class StatusHasAssociatedTasksError extends Error {

    constructor(id: string) {
        super(`Status with id '${id}' has associated tasks`);
        this.name = 'StatusHasAssociatedTasksError';
    }

}