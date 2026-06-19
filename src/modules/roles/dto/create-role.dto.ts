import { USER_ROLE_ENUM } from "@common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({
        enum: USER_ROLE_ENUM,
        example: USER_ROLE_ENUM.CUSTOMER
    })
    @IsNotEmpty()
    @IsEnum(USER_ROLE_ENUM)
    name: USER_ROLE_ENUM

    @ApiProperty({ type: Array })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    permission_ids: number[];
}
