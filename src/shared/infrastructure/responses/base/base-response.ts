import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseResponse {

    @ApiProperty({ example: true })
    public readonly success: boolean;

    @ApiProperty({ example: HttpStatus.CREATED })
    public readonly statusCode: HttpStatus;

    @ApiProperty({ example: 'Created Successfully' })
    public readonly message: string;

    @ApiProperty({ example: '/statuses' })
    public readonly path: string;

    @ApiProperty({ example: new Date().toISOString() })
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