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
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard, USER_ROLE_ENUM } from '@common';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  // @ApiBearerAuth()
  // @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @ApiBearerAuth()
  @Roles(USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
