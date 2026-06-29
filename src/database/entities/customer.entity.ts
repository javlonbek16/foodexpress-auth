import { AbstractEntity } from 'database/abstract.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { UsersEntity } from './user.entity';

@Entity({ name: 'customers' })
@Index(['user_id'])
export class CustomersEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  phone_number: string;

  @Column({ type: 'int' })
  user_id: number;

  @OneToOne(() => UsersEntity, (user) => user.customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
