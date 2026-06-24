import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard, USER_ROLE_ENUM } from '@common';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @ApiBearerAuth()
  // @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('activate/:id')
  async activateUser(@Param('id') id: number) {
    return this.usersService.activateUser(+id);
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('role-update')
  roleUpdate(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.usersService.roleUpdate(updateUserRoleDto);
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
