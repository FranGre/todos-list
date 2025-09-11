import { HttpStatus } from "@nestjs/common";
import { BaseResponse } from "../base/base-response";
import { ApiProperty } from "@nestjs/swagger";
import { randomUUID } from "crypto";

export class SuccessResponse extends BaseResponse {

    @ApiProperty({ example: { id: randomUUID(), name: 'jej' } })
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