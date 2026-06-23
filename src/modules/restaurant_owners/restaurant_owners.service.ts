import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantOwnerDto, UpdateRestaurantOwnerDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantOwnersEntity } from '@database';
import { Repository } from 'typeorm';
import { UsersService } from 'modules/users';

@Injectable()
export class RestaurantOwnersService {
  constructor(
    @InjectRepository(RestaurantOwnersEntity)
    private readonly restaurantOwnersRepository: Repository<RestaurantOwnersEntity>,
    private readonly userService: UsersService
  ) { }
  async create(createRestaurantOwnerDto: CreateRestaurantOwnerDto) {
    const user = await this.userService.findOne(createRestaurantOwnerDto.user_id)
    return await this.restaurantOwnersRepository.save({ name: createRestaurantOwnerDto.name, user_id: user.id });
  }

  async findAll() {
    return await this.restaurantOwnersRepository.find();
  }

  async findOne(id: number) {
    const restaurant_owner = await this.restaurantOwnersRepository.findOne({ where: { id } })
    if (!restaurant_owner) {
      throw new NotFoundException("restaurant_owner not found")
    }
    return restaurant_owner;
  }

  async update(id: number, updateRestaurantOwnerDto: UpdateRestaurantOwnerDto) {
    const restaurant_owner = await this.findOne(id)
    Object.assign(restaurant_owner, updateRestaurantOwnerDto)
    return await this.restaurantOwnersRepository.save(restaurant_owner)
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.restaurantOwnersRepository.delete(id);
  }
}
