import { AbstractEntity } from 'database/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { RolesEntity } from './role.entity';
import { CustomersEntity } from './customer.entity';
import { Exclude } from 'class-transformer';
import { CouriersEntity } from './courier.entity';
import { RestaurantOwnersEntity } from './restaurant_owner.entity';
import { AdminsEntity } from './admin.entity';

@Entity({ name: 'users' })
@Index(['email'])
export class UsersEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 1000 })
  hashed_password: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'int' })
  role_id: number;

  @ManyToOne(() => RolesEntity)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @OneToOne(() => CustomersEntity, (customer) => customer.user)
  customer: CustomersEntity;

  @OneToOne(() => CouriersEntity, (courier) => courier.user)
  courier: CouriersEntity;

  @OneToOne(() => AdminsEntity, (admin) => admin.user)
  admin: AdminsEntity;

  @OneToOne(
    () => RestaurantOwnersEntity,
    (restaurant_owner) => restaurant_owner.user,
  )
  restaurant_owner: RestaurantOwnersEntity;
}
