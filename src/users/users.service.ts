import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionName } from 'src/jwt/jwt-payload.type';
import { Role } from 'src/roles/roles.entity';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

  async addRole(id: number, name: string) {
    const user = await this.userRepository.findOneBy({ id });
    const role = await this.roleRepository.findOneBy({ name });

    if (user && role) {
      user.roles.push(role);
      await this.userRepository.save(user);
    }
  }

  async getPermissions(email: string): Promise<PermissionName[]> {
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
