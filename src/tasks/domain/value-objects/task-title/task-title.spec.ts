import { TaskTitleEmptyError } from "../../errors/task-title-empty-error";
import { TaskTitleTooLongError } from "../../errors/task-title-too-long-error";
import { TaskTitle } from "./task-title";

describe('TaskTitle Value Object', () => {
    it('should create a task title when receives a valid value', () => {
        const validValue = 'Pendiente';

        expect(new TaskTitle(validValue).value())
        .toBe(validValue);
    });

    it('should throw error when receives an empty value', () => {
        expect(() => new TaskTitle(''))
        .toThrow(TaskTitleEmptyError);
    });

    it('should throw error when value is too long', () => {
        const tooLongValue = '1'.repeat(101);

        expect(() => new TaskTitle(tooLongValue))
        .toThrow(TaskTitleTooLongError);
    });
});