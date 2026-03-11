import { Stats } from 'src/stats/entity/stats.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('torrents')
export class Torrent {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'info_hash', unique: true })
  @OneToOne(() => Stats, (stats) => stats.infoHash)
  infoHash: string;

  @Column({ name: 'upload_modifier', default: 1 })
  uploadModifier: number;

  @Column({ name: 'download_modifier', default: 1 })
  downloadModifier: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
