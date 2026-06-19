import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateRestaurantOwnerDto } from './create-restaurant_owner.dto';

export class UpdateRestaurantOwnerDto extends PartialType(OmitType(CreateRestaurantOwnerDto, ["user_id"] as const)) { }
