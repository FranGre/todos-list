export class StatusNameAlreadyExistsError extends Error {

    constructor(name: string) {
        super(`Status Name ${name} already exists`);
        this.name = 'StatusNameAlreadyExistsError';
    }

}