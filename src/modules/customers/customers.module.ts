import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersEntity } from 'database/entities/customer.entity';
import { UsersModule } from 'modules/users';

@Module({
  imports: [TypeOrmModule.forFeature([CustomersEntity]), UsersModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService]
})
export class CustomersModule { }
