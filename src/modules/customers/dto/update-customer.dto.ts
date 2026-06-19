import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(OmitType(CreateCustomerDto, ["user_id"] as const)) { }
