import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TrackerEvent } from '../stats.types';
import { Torrent } from 'src/torrents/torrents.entity';

@Entity('stats')
export class Stats {
  @PrimaryColumn({ name: 'info_hash' })
  @OneToOne(() => Torrent, (torrent) => torrent.infoHash)
  @JoinColumn()
  infoHash: string;

  @PrimaryColumn({ name: 'user_key' })
  userKey: string;

  @Column({ name: 'peer_id', unique: true })
  peerId: string;

  @Column({
    name: 'event',
    type: 'enum',
    enum: TrackerEvent,
  })
  event: TrackerEvent;

  @Column({ name: 'uploaded' })
  uploaded: number;

  @Column({ name: 'downloaded' })
  downloaded: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
