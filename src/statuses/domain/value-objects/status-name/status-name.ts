import { StatusNameEmptyError } from "../../errors/status-name-empty-error";
import { StatusNameTooLongError } from "../../errors/status-name-too-long-error";

export class StatusName {

    static MAX_LENGTH = 50;

    private readonly _value: string;

    constructor(value: string) {
        this.validateOrThrow(value);
        this._value = value;
    }

    private validateOrThrow(value: string) {
        if (!value) {
            throw new StatusNameEmptyError();
        }

        if (value.length > StatusName.MAX_LENGTH ) {
            throw new StatusNameTooLongError();
        }
    }

    public value(): string {
        return this._value;
    }

}