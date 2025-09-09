import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateStatusCommand } from 'src/statuses/application/create-status/create-status-command';
import { CreateStatusUseCase } from 'src/statuses/application/create-status/create-status-use-case';
import { CreateStatusDto } from './create-status-dto';
import { CreateStatusResult } from 'src/statuses/application/create-status/create-status-result';
import { StatusNameAlreadyExistsError } from 'src/statuses/domain/errors/status-name-already-exists-error';
import { StatusNameEmptyError } from 'src/statuses/domain/errors/status-name-empty-error';
import { StatusNameTooLongError } from 'src/statuses/domain/errors/status-name-too-long-error';

@Controller('statuses')
export class CreateStatusController {

    constructor(private _createStatusUseCase: CreateStatusUseCase) { }

    @Post()
    async execute(@Body() dto: CreateStatusDto) {
        const command = new CreateStatusCommand(dto.name);
        try {
            const result: CreateStatusResult = await this._createStatusUseCase.execute(command);
            return {
                message: 'Created successfully',
                status: HttpStatus.CREATED,
                data: result
            };
        } catch (error) {
            if (error instanceof StatusNameAlreadyExistsError) {
                throw new HttpException(
                    {
                        message: error.message
                    },
                    HttpStatus.CONFLICT);
            }

            if (error instanceof StatusNameEmptyError) {
                throw new HttpException(
                    {
                        message: error.message
                    },
                    HttpStatus.CONFLICT);
            }
            
            if (error instanceof StatusNameTooLongError) {
                throw new HttpException(
                    {
                        message: error.message
                    },
                    HttpStatus.CONFLICT);
            }

            throw new HttpException(
                { status: 'error', message: 'Internal Server Error' },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
