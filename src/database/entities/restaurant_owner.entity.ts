import { AbstractEntity } from 'database/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UsersEntity } from './user.entity';

@Entity({ name: 'restaurant_owners' })
export class RestaurantOwnersEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  user_id: number;

  @OneToOne(() => UsersEntity, (user) => user.customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
