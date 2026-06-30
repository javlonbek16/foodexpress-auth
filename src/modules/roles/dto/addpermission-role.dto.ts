import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class AddPermissionToRoleDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  role_id: number;

  @ApiProperty({ type: Array })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  permission_ids: number[];
}
