import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { Permission } from './entities/permissions.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    return this.userRepository.save(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async isValid(userKey: string): Promise<boolean> {
    return this.userRepository
      .findOneBy({
        key: userKey,
        validated: true,
      })
      .then((e) => !!e);
  }

  async getPermissions(email: string): Promise<Permission[]> {
    return await this.userRepository
      .find({
        where: {
          email,
        },
        relations: {
          roles: {
            permissions: true,
          },
        },
      })
      .then((users) =>
        users.flatMap((user) => user.roles.flatMap((role) => role.permissions)),
      );
  }
}
