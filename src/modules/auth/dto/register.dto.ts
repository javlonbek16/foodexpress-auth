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
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,20}$/, {
    message:
      'Password must be between 6 and 20 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character',
  })
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
