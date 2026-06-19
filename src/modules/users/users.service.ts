import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CouriersEntity,
  CustomersEntity,
  RestaurantOwnersEntity,
  UsersEntity,
} from '@database';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { RolesService } from 'modules/roles';
import { USER_ROLE_ENUM } from '@common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly rolesService: RolesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, role_id, email, ...data } = createUserDto;
    const existUser = await this.usersRepository.findOne({ where: { email } });
    if (existUser) {
      throw new BadRequestException('user already exists');
    }

    const role = role_id
      ? await this.rolesService.findOne(role_id)
      : await this.rolesService.findOneByName(USER_ROLE_ENUM.CUSTOMER);

    if (!role) {
      throw new BadRequestException('role not found');
    }

    const hashed_password = await bcrypt.hash(password, 7);

    const user = await this.dataSource.transaction(async (manager) => {
      const newUser = manager.create(UsersEntity, {
        hashed_password,
        role_id: role.id,
        email,
        is_active: role.name === USER_ROLE_ENUM.CUSTOMER ? true : false,
        ...data,
      });

      await manager.save(newUser);
      if (role.name === USER_ROLE_ENUM.CUSTOMER) {
        await manager.save(CustomersEntity, {
          name: data.name,
          user_id: newUser.id,
        });
      }
      if (role.name === USER_ROLE_ENUM.COURIER) {
        await manager.save(CouriersEntity, {
          name: data.name,
          user_id: newUser.id,
        });
      }
      if (role.name === USER_ROLE_ENUM.RESTAURANT_OWNER) {
        await manager.save(RestaurantOwnersEntity, {
          name: data.name,
          user_id: newUser.id,
        });
      }
      return newUser;
    });
    return user;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
      relations: { role: { permissions: true } },
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.usersRepository.softDelete(id);
  }
}
