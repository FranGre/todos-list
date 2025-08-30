export class StatusIdInvalidFormatError extends Error {

    constructor() {
        super('StatusId has not a valid uuid format');
        this.name = 'StatusIdInvalidFormatError';
    }

}