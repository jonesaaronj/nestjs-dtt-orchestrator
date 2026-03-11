import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Column,
} from 'typeorm';
import { PermissionName } from 'src/jwt/jwt-payload.type';
import { User } from 'src/users/users.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @Column({
    type: 'enum',
    enum: PermissionName,
    array: true,
  })
  permissions: PermissionName[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
