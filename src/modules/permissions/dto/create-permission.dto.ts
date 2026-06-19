import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    code: string
}
