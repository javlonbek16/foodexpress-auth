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
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddPermissionToRoleDto, CreateRoleDto, UpdateRoleDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard, USER_ROLE_ENUM } from '@common';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('add-permission')
  async addPermission(@Body() addPermissionToRoleDto: AddPermissionToRoleDto) {
    return this.rolesService.addPermission(addPermissionToRoleDto);
  }

  @Get('for-client')
  findAllForClient() {
    return this.rolesService.findAllForClient();
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
