import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateCourierDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @IsNumber()
    user_id: number
}
