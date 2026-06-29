import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  //   @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
  //     message: 'Only Gmail addresses are accepted (@gmail.com)',
  //   })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  phone_number: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  role_id: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  otpToken: string;
}
