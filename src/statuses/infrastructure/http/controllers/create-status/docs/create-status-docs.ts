import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { CreateStatusDto } from "../create-status-dto";
import { HttpStatus } from "@nestjs/common";
import { SuccessResponse } from "src/shared/infrastructure/responses/success/success-response";
import { ErrorResponse } from "src/shared/infrastructure/responses/error/error-response";

export class CreateStatusDocs {
    static docs() {
        return [
            ApiBody({ type: CreateStatusDto }),
            ApiResponse({ status: HttpStatus.CREATED, type: SuccessResponse, description: 'Status created successfully' }),
            ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorResponse, description: 'Status Name already exists' }),
            ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorResponse, description: 'Status Name cannot be empty' }),
            ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorResponse, description: 'Status Name has exceed max length' })
        ];
    }
}