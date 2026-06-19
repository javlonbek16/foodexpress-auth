import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsEntitiy } from '@database';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionsEntitiy])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule { }
