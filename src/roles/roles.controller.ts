import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { permissionGate } from 'src/utils/permissionGate';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { PermissionName } from 'src/jwt/jwt-payload.type';
import type { Request } from 'express';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Put('role/create')
  @UseGuards(JwtAuthGuard)
  createRole(@Req() request: Request, @Body() name: string) {
    return permissionGate(request, PermissionName.RoleCreate, () =>
      this.rolesService.createRole(name),
    );
  }

  @Patch('role/addPermission')
  @UseGuards(JwtAuthGuard)
  addRolePermission(
    @Req() request: Request,
    @Body() name: string,
    @Body() permission: PermissionName,
  ) {
    return permissionGate(request, PermissionName.RoleAssignPermission, () =>
      this.rolesService.addRolePermission(name, permission),
    );
  }

  @Patch('role/removePermission')
  @UseGuards(JwtAuthGuard)
  removeRolePermission(
    @Req() request: Request,
    @Body() name: string,
    @Body() permission: PermissionName,
  ) {
    return permissionGate(request, PermissionName.RoleCreate, () =>
      this.rolesService.removeRolePermission(name, permission),
    );
  }

  @Delete('role/delete')
  @UseGuards(JwtAuthGuard)
  removeRole(@Req() request: Request, @Param() name: string) {
    return permissionGate(request, PermissionName.RoleRemove, () =>
      this.rolesService.removeRole(name),
    );
  }

  @Get('role/list')
  @UseGuards(JwtAuthGuard)
  listRoles(@Req() request: Request) {
    return permissionGate(request, PermissionName.RoleList, () =>
      this.rolesService.listRole(),
    );
  }
}
