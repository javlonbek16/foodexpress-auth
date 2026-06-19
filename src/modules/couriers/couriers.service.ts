import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CouriersEntity } from '@database';
import { Repository } from 'typeorm';
import { UsersService } from 'modules/users';

@Injectable()
export class CouriersService {
  constructor(
    @InjectRepository(CouriersEntity)
    private readonly couriersRepository: Repository<CouriersEntity>,
    private readonly userService: UsersService
  ) { }
  async create(createCourierDto: CreateCourierDto) {
    const user = await this.userService.findOne(createCourierDto.user_id)
    return await this.couriersRepository.save({ name: createCourierDto.name, user_id: user.id });
  }

  async findAll() {
    return await this.couriersRepository.find()
  }

  async findOne(id: number) {
    const courier = await this.couriersRepository.findOne({ where: { id } })
    if (!courier) {
      throw new NotFoundException("courier not found")
    }
    return courier;
  }

  async update(id: number, updateCourierDto: UpdateCourierDto) {
    const courier = await this.findOne(id)

    Object.assign(courier, updateCourierDto)

    return await this.couriersRepository.save(courier)
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.couriersRepository.softDelete(id);
  }
}
