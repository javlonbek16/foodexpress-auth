import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersEntity } from '@database';
import { Repository } from 'typeorm';
import { UsersService } from 'modules/users';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersEntity)
    private readonly customersRepository: Repository<CustomersEntity>,
    private readonly userService: UsersService
  ) { }
  async create(createCustomerDto: CreateCustomerDto) {
    const user = await this.userService.findOne(createCustomerDto.user_id)
    return await this.customersRepository.save({ name: createCustomerDto.name, user_id: user.user_id });
  }

  async findAll() {
    return await this.customersRepository.find()
  }

  async findOne(id: number) {
    const customer = await this.customersRepository.findOne({ where: { id } })
    if (!customer) {
      throw new NotFoundException("customer not found")
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id)

    Object.assign(customer, updateCustomerDto)

    return await this.customersRepository.save(customer)
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.customersRepository.delete(id);
  }
}
