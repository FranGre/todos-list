import { HttpStatus } from "@nestjs/common";
import { BaseResponse } from "../base/base-response";

export class SuccessResponse extends BaseResponse {

    public readonly data: any;

    constructor(
        statusCode: HttpStatus,
        message: string,
        data: any,
        path: string,
    ) {
        super(true, statusCode, message, path);
        this.data = data;
    }

}