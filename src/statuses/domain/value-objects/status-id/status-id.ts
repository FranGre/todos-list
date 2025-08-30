import { randomUUID } from "node:crypto";
import { StatusIdInvalidFormatError } from "../../errors/status-id-invalid-format-error";

export class StatusId {

    private readonly _value: string;

    constructor(value?: string) {
        if (!value) {
            this._value = randomUUID();
            return;
        }

        this.validateOrThrow(value);
        this._value = value;
    }

    private validateOrThrow(value: string) {
        if(!value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
            throw new StatusIdInvalidFormatError();
        }
    }

    public value(): string {
        return this._value;
    }

}