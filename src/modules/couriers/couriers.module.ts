import { Module } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { CouriersController } from './couriers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouriersEntity } from '@database';
import { UsersModule } from 'modules/users';

@Module({
  imports: [TypeOrmModule.forFeature([CouriersEntity]), UsersModule],
  controllers: [CouriersController],
  providers: [CouriersService],
  exports:[CouriersService]
})
export class CouriersModule { }
