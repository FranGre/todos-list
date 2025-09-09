import { HttpStatus } from "@nestjs/common";

export abstract class BaseResponse {

    public readonly success: boolean;
    public readonly statusCode: HttpStatus;
    public readonly message: string;
    public readonly path: string;
    public readonly timestamp: string;

    constructor(
        success: boolean,
        statusCode: HttpStatus,
        message: string,
        path: string
    ) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.path = path;
        this.timestamp = new Date().toISOString();
    }

}