import { StatusName } from "../value-objects/status-name/status-name";

export class StatusNameTooLongError extends Error {

    constructor() {
        super(`StatusName has exceeded the maximum length (${StatusName.MAX_LENGTH})`);
        this.name = 'StatusNameTooLongError';
    }

}