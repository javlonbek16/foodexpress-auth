import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCourierDto } from './dto';

@ApiTags('Couriers')
@Controller('couriers')
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  @Get()
  findAll() {
    return this.couriersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couriersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourierDto: UpdateCourierDto) {
    return this.couriersService.update(+id, updateCourierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couriersService.remove(+id);
  }
}
