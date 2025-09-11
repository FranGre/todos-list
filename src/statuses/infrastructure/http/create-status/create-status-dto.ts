import { ApiProperty } from "@nestjs/swagger";
import { StatusName } from "src/statuses/domain/value-objects/status-name/status-name";

export class CreateStatusDto {
    @ApiProperty({
        type: String,
        required: true,
        example: 'Pendiente',
        maxLength: StatusName.MAX_LENGTH,
    })
    name: string;
}