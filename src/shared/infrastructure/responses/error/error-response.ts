import { HttpStatus } from "@nestjs/common";
import { BaseResponse } from "../base/base-response";

export class ErrorResponse extends BaseResponse {

    public readonly error: string;

    constructor(
        statusCode: HttpStatus,
        message: string,
        error: string,
        path: string,
    ) {
        super(false, statusCode, message, path);
        this.error = error;
    }

}