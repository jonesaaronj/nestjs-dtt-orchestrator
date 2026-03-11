import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { PermissionName } from 'src/jwt/jwt-payload.type';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(name: string) {
    await this.roleRepository.insert({ name });
  }

  async removeRole(name: string) {
    await this.roleRepository.delete({ name });
  }

  async listRole() {
    await this.roleRepository.find();
  }

  async addRolePermission(name: string, permission: PermissionName) {
    const role = await this.roleRepository.findOneBy({ name });

    if (role && !role.permissions.includes(permission)) {
      role.permissions.push(permission);
      await this.roleRepository.save(role);
    }
  }

  async removeRolePermission(name: string, permission: PermissionName) {
    const role = await this.roleRepository.findOneBy({ name });

    if (role) {
      role.permissions = role.permissions.filter(
        (permissionName) => permission != permissionName,
      );
      await this.roleRepository.save(role);
    }
  }
}
