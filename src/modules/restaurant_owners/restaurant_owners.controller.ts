import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantOwnersService } from './restaurant_owners.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRestaurantOwnerDto, UpdateRestaurantOwnerDto } from './dto';

@ApiTags("Restaurant Owners")
@Controller('restaurant-owners')
export class RestaurantOwnersController {
  constructor(private readonly restaurantOwnersService: RestaurantOwnersService) { }

  @Post()
  create(@Body() createRestaurantOwnerDto: CreateRestaurantOwnerDto) {
    return this.restaurantOwnersService.create(createRestaurantOwnerDto);
  }

  @Get()
  findAll() {
    return this.restaurantOwnersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantOwnersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantOwnerDto: UpdateRestaurantOwnerDto) {
    return this.restaurantOwnersService.update(+id, updateRestaurantOwnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantOwnersService.remove(+id);
  }
}
