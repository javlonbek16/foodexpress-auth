import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}
