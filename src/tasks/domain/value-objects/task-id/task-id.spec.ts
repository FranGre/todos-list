import { TaskIdInvalidFormatError } from "../../errors/task-id-invalid-format-error";
import { TaskId } from "./task-id";

describe('TaskId Value Object', () => {
    it('should create a task id when recives a valid value', () => {
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';

        expect(new TaskId(validUuid).value())
        .toBe(validUuid);
    });

    it('should create a task id when recives an empty value', () => {
        const statusId = new TaskId();

        expect(statusId.value())
        .toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should throw error when task id has an invalid uuid format', () => {
        const invalidUuid = '123e4567-e89b-12d3-a456426614174000';

        expect(() => new TaskId(invalidUuid))
        .toThrow(TaskIdInvalidFormatError);
    });
});