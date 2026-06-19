import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCourierDto } from './create-courier.dto';

export class UpdateCourierDto extends PartialType(OmitType(CreateCourierDto, ["user_id"] as const)) { }
