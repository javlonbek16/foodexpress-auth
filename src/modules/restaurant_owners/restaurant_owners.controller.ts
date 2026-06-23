import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RestaurantOwnersService } from './restaurant_owners.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRestaurantOwnerDto, UpdateRestaurantOwnerDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard, USER_ROLE_ENUM } from '@common';

@ApiTags('Restaurant Owners')
@Controller('restaurant-owners')
export class RestaurantOwnersController {
  constructor(
    private readonly restaurantOwnersService: RestaurantOwnersService,
  ) {}

  @Get()
  findAll() {
    return this.restaurantOwnersService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantOwnerDto: UpdateRestaurantOwnerDto,
  ) {
    return this.restaurantOwnersService.update(+id, updateRestaurantOwnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantOwnersService.remove(+id);
  }
}
