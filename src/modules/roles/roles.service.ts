import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsEntitiy, RolesEntity } from '@database';
import { In, Not, Repository } from 'typeorm';
import { USER_ROLE_ENUM } from '@common';
import { AddPermissionToRoleDto } from './dto';

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
    return await this.rolesRepository.find({
      relations: { permissions: true },
    });
  }

  async findAllForClient() {
    return await this.rolesRepository.find({
      where: {
        name: Not(
          In([
            USER_ROLE_ENUM.ADMIN,
            USER_ROLE_ENUM.SUPERADMIN,
            USER_ROLE_ENUM.CUSTOMER,
          ]),
        ),
      },
    });
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

  async addPermission(addPermissionToRoleDto: AddPermissionToRoleDto) {
    const role = await this.rolesRepository.findOne({
      where: { id: addPermissionToRoleDto.role_id },
      relations: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException('role not found');
    }

    const permissions = await this.permissionRepository.find({
      where: { id: In(addPermissionToRoleDto.permission_ids) },
    });

    if (permissions.length !== addPermissionToRoleDto.permission_ids.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    const existingIds = role.permissions.map((p) => p.id);
    const newPermissions = permissions.filter(
      (p) => !existingIds.includes(p.id),
    );

    role.permissions = [...role.permissions, ...newPermissions];
    return this.rolesRepository.save(role);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.rolesRepository.delete(id);
  }
}
