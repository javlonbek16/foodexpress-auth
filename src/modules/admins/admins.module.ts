import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsEntity } from '@database';
import { UsersModule } from 'modules/users';

@Module({
  imports: [TypeOrmModule.forFeature([AdminsEntity]), UsersModule],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
