import { AbstractEntity } from 'database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokensEntity extends AbstractEntity {
  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar', length: 10000 })
  hashed_token: string;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
