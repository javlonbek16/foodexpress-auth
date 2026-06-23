import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  USER_ROLE_ENUM,
} from '@common';
import { UsersEntity } from '@database';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findOne(@CurrentUser() currenUser: UsersEntity) {
    return this.usersService.findOne(currenUser.id);
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
