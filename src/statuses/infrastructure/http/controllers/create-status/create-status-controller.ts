import { applyDecorators, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateStatusCommand } from 'src/statuses/application/create-status/create-status-command';
import { CreateStatusUseCase } from 'src/statuses/application/create-status/create-status-use-case';
import { CreateStatusDto } from './create-status-dto';
import { CreateStatusResult } from 'src/statuses/application/create-status/create-status-result';
import { StatusNameAlreadyExistsError } from 'src/statuses/domain/errors/status-name-already-exists-error';
import { StatusNameEmptyError } from 'src/statuses/domain/errors/status-name-empty-error';
import { StatusNameTooLongError } from 'src/statuses/domain/errors/status-name-too-long-error';
import { BaseResponse } from 'src/shared/infrastructure/responses/base/base-response';
import { SuccessResponse } from 'src/shared/infrastructure/responses/success/success-response';
import { ErrorResponse } from 'src/shared/infrastructure/responses/error/error-response';
import { ApiTags } from '@nestjs/swagger';
import { CreateStatusDocs } from './docs/create-status-docs';

@ApiTags('statuses')
@Controller('statuses')
export class CreateStatusController {

    constructor(private _createStatusUseCase: CreateStatusUseCase) { }

    @Post()
    @applyDecorators(...CreateStatusDocs.docs())
    async execute(@Body() dto: CreateStatusDto): Promise<BaseResponse> {
        const command = new CreateStatusCommand(dto.name);
        try {
            const result: CreateStatusResult = await this._createStatusUseCase.execute(command);
            return new SuccessResponse(HttpStatus.CREATED, 'status created successfully', result, '/statuses');
        } catch (error) {
            if (error instanceof StatusNameAlreadyExistsError) {
                return new ErrorResponse(HttpStatus.CONFLICT, error.message, error.name, '/statuses');
            }

            if (error instanceof StatusNameEmptyError) {
                return new ErrorResponse(HttpStatus.CONFLICT, error.message, error.name, '/statuses');
            }

            if (error instanceof StatusNameTooLongError) {
                return new ErrorResponse(HttpStatus.CONFLICT, error.message, error.name, '/statuses');
            }

            return new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', 'SERVER ERROR', '/statuses');
        }
    }
}
