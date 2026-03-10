import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Column,
} from 'typeorm';
import { TrackerEvent } from '../ratio.types';

@Entity('ratio')
export class Ratio {
  @PrimaryColumn({ name: 'info_hash' })
  infoHash: string;

  @PrimaryColumn({ name: 'user_key' })
  userKey: string;

  @Column({ unique: true })
  peerId: string;

  @Column({
    type: 'enum',
    enum: TrackerEvent,
  })
  event: TrackerEvent;

  @Column()
  uploaded: number;

  @Column()
  downloaded: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
