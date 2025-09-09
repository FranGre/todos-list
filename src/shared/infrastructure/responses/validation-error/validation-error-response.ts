import { HttpStatus } from "@nestjs/common";
import { ErrorResponse } from "../error/error-response";

export class ValidationErrorReponse extends ErrorResponse {

    public readonly errors: [];

    constructor(
        statusCode: HttpStatus,
        message: string,
        error: any,
        path: string,
        errors: [],
    ) {
        super(statusCode, message, error, path);
        this.errors = errors;
    }

}