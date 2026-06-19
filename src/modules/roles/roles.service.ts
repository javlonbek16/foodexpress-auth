import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsEntitiy, RolesEntity } from '@database';
import { In, Repository } from 'typeorm';
import { USER_ROLE_ENUM } from '@common';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,

    @InjectRepository(PermissionsEntitiy)
    private readonly permissionRepository: Repository<PermissionsEntitiy>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const { permission_ids, name } = createRoleDto;

    const permissions = await this.permissionRepository.findBy({
      id: In(permission_ids),
    });
    console.log(permissions);

    if (permissions.length !== permission_ids.length) {
      throw new BadRequestException('One or more permissions not found');
    }
    const role = this.rolesRepository.create({
      name,
      permissions,
    });

    return await this.rolesRepository.save(role);
  }

  async findAll() {
    return await this.rolesRepository.find();
  }

  async findOneByName(name: USER_ROLE_ENUM) {
    const role = await this.rolesRepository.findOne({ where: { name } });
    if (!role) {
      throw new NotFoundException('role not found');
    }
    return role;
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('role not found');
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.permission_ids !== undefined) {
      const permissions = await this.permissionRepository.findBy({
        id: In(updateRoleDto.permission_ids),
      });

      if (permissions.length !== updateRoleDto.permission_ids.length) {
        throw new BadRequestException('One or more permissions not found');
      }

      role.permissions = permissions;
    }

    return await this.rolesRepository.save(role);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.rolesRepository.softDelete(id);
  }
}
