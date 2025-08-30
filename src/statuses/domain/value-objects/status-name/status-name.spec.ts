import { StatusNameEmptyError } from "../../errors/status-name-empty-error";
import { StatusNameTooLongError } from "../../errors/status-name-too-long-error";
import { StatusName } from "./status-name";

describe('StatusName Value Object', () => {
    it('should create a status name when receives a valid value', () => {
        const validValue = 'Pendiente';

        expect(new StatusName(validValue).value())
        .toBe(validValue);
    });

    it('should throw error when receives an empty value', () => {
        expect(() => new StatusName(''))
        .toThrow(StatusNameEmptyError);
    });

    it('should throw error when value is too long', () => {
        const tooLongValue = '1'.repeat(51);

        expect(() => new StatusName(tooLongValue))
        .toThrow(StatusNameTooLongError);
    });
});