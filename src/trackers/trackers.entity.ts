import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trackers')
export class Tracker {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uri', unique: true })
  uri: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
