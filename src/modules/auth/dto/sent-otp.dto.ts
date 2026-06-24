import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SentOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  //   @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
  //     message: 'Only Gmail addresses are accepted (@gmail.com)',
  //   })
  @IsEmail()
  email: string;
}
