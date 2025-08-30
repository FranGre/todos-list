export class StatusNameEmptyError extends Error {

    constructor() {
        super('StatusName cannot be empty');
        this.name = 'StatusNameEmptyError';
    }

}