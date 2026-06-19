import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsEntitiy } from '@database';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionsEntitiy)
    private readonly permissionRepository: Repository<PermissionsEntitiy>
  ) { }
  async create(createPermissionDto: CreatePermissionDto) {
    return await this.permissionRepository.save(createPermissionDto)
  }

  async findAll() {
    return await this.permissionRepository.find()
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findOne({ where: { id } })
    if (!permission) {
      throw new NotFoundException("permission not found")
    }
    return permission
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id)
    return await this.permissionRepository.update(id, updatePermissionDto)
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.permissionRepository.softDelete(id)
  }
}
