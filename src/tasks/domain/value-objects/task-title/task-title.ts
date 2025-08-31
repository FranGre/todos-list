import { TaskTitleEmptyError } from "../../errors/task-title-empty-error";
import { TaskTitleTooLongError } from "../../errors/task-title-too-long-error";

export class TaskTitle {

    static MAX_LENGTH = 50;

    private readonly _value: string;

    constructor(value: string) {
        this.validateOrThrow(value);
        this._value = value;
    }

    private validateOrThrow(value: string) {
        if (!value) {
            throw new TaskTitleEmptyError();
        }

        if (value.length > TaskTitle.MAX_LENGTH ) {
            throw new TaskTitleTooLongError();
        }
    }

    public value(): string {
        return this._value;
    }

}