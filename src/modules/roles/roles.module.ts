import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from 'database/entities/role.entity';
import { PermissionsEntitiy } from '@database';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity, PermissionsEntitiy]),],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule { }
