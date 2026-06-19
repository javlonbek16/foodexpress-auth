import { Module } from '@nestjs/common';
import { RestaurantOwnersService } from './restaurant_owners.service';
import { RestaurantOwnersController } from './restaurant_owners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'modules/users';
import { RestaurantOwnersEntity } from '@database';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantOwnersEntity]), UsersModule],
  controllers: [RestaurantOwnersController],
  providers: [RestaurantOwnersService],
  exports: [RestaurantOwnersService]
})
export class RestaurantOwnersModule { }
