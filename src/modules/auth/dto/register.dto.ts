import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    password: string

    @ApiProperty({ type: Number })
    @IsOptional()
    @IsNumber()
    role_id: number

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    otpToken: string
}
