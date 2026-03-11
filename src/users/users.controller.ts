import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { permissionGate } from 'src/utils/permissionGate';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { PermissionName } from 'src/jwt/jwt-payload.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('addRole')
  @UseGuards(JwtAuthGuard)
  addRole(
    @Req() request: Request,
    @Body() id: number,
    @Body() permission: PermissionName,
  ) {
    return permissionGate(request, PermissionName.UserAssignRole, () =>
      this.usersService.addRole(id, permission),
    );
  }
}
