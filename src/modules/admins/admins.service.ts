import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { AdminsEntity } from '@database';
import { UsersService } from 'modules/users';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminsEntity)
    private readonly adminsRepository: Repository<AdminsEntity>,
    private readonly usersService: UsersService,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    return await this.usersService.create(createAdminDto);
  }

  async findAll() {
    return await this.adminsRepository.find();
  }

  async findOne(id: number) {
    const admin = await this.adminsRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('admin not found');
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id);
    Object.assign(admin, updateAdminDto);
    return await this.adminsRepository.save(admin);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.adminsRepository.delete(id);
  }
}
