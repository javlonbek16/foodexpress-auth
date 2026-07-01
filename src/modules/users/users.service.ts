import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdminsEntity,
  CouriersEntity,
  CustomersEntity,
  RestaurantOwnersEntity,
  UsersEntity,
} from '@database';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserRoleDto } from './dto';
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
        is_active:
          role.name === USER_ROLE_ENUM.CUSTOMER ||
          role.name === USER_ROLE_ENUM.ADMIN ||
          role.name === USER_ROLE_ENUM.SUPERADMIN
            ? true
            : false,
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
      if (
        role.name === USER_ROLE_ENUM.ADMIN ||
        role.name === USER_ROLE_ENUM.SUPERADMIN
      ) {
        await manager.save(AdminsEntity, {
          name: data.name,
          user_id: newUser.id,
        });
      }
      return newUser;
    });
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find({
      relations: {
        role: true,
        admin: true,
        courier: true,
        customer: true,
        restaurant_owner: true,
      },
    });
    return users.map((user) => {
      const { admin, courier, customer, restaurant_owner, role, ...rest } =
        user;
      const roleName = role.name;
      const profile =
        user.admin ??
        user.customer ??
        user.restaurant_owner ??
        user.admin ??
        user.courier ??
        null;

      return {
        ...rest,
        role: roleName,
        [roleName]: profile,
      };
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: {
        role: { permissions: true },
        admin: true,
        courier: true,
        customer: true,
        restaurant_owner: true,
      },
    });
    if (!user) return null;

    const { admin, courier, customer, restaurant_owner, role, ...rest } = user;
    const roleName = role.name;
    const profile =
      user.admin ??
      user.customer ??
      user.restaurant_owner ??
      user.admin ??
      user.courier ??
      null;

    return {
      ...rest,
      role: roleName,
      permissions: role.permissions,
      roleName: profile,
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        role: { permissions: true },
        admin: true,
        courier: true,
        customer: true,
        restaurant_owner: true,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const { admin, courier, customer, restaurant_owner, role, ...rest } = user;
    const roleName = role.name;
    const profile =
      user.admin ??
      user.customer ??
      user.restaurant_owner ??
      user.courier ??
      null;

    return {
      user_id: rest.id,
      name: profile.name,
      email: user.email,
      phone_number: profile.phone_number,
      role: roleName,
      permissions: role.permissions,
    };
  }

  async roleUpdate(updateUserRoleDto: UpdateUserRoleDto) {
    const { user_id, role_id } = updateUserRoleDto;

    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const role = await this.rolesService.findOne(role_id);
    user.role_id = role.id;

    return await this.usersRepository.save(user);
  }

  async activateUser(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.is_active) {
      throw new BadRequestException('User already activated');
    }

    user.is_active = true;
    await this.usersRepository.save(user);

    return { message: 'User activated successfully' };
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.usersRepository.delete(id);
  }
}
