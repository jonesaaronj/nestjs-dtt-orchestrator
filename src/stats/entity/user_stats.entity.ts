import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity('user_stats')
export class UserStats {
  @PrimaryColumn({ name: 'user_key' })
  userKey: string;

  @Column()
  uploaded: number;

  @Column()
  downloaded: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
