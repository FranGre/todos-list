import { StatusIdInvalidFormatError } from "../../errors/status-id-invalid-format-error";
import { StatusId } from "./status-id";

describe('StatusId Value Object', () => {
    it('should create a status id when recives a valid value', () => {
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';

        expect(new StatusId(validUuid).value())
        .toBe(validUuid);
    });

    it('should create a status id when recives an empty value', () => {
        const statusId = new StatusId();

        expect(statusId.value())
        .toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should throw error when status id has an invalid uuid format', () => {
        const invalidUuid = '123e4567-e89b-12d3-a456426614174000';

        expect(() => new StatusId(invalidUuid))
        .toThrow(StatusIdInvalidFormatError);
    });
});