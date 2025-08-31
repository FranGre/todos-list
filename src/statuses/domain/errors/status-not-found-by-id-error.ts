export class StatusNotFoundByIdError extends Error {

    constructor(id: string) {
        super(`Status with id '${id}' was not found`);
        this.name = 'StatusNotFoundByIdError';
    }

}