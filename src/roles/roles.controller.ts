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

  @Put('create')
  @UseGuards(JwtAuthGuard)
  create(@Req() request: Request, @Body() name: string) {
    return permissionGate(request, PermissionName.RoleCreate, () =>
      this.rolesService.createRole(name),
    );
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard)
  remove(@Req() request: Request, @Param() name: string) {
    return permissionGate(request, PermissionName.RoleRemove, () =>
      this.rolesService.removeRole(name),
    );
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  listRoles(@Req() request: Request) {
    return permissionGate(request, PermissionName.RoleList, () =>
      this.rolesService.listRole(),
    );
  }

  @Patch('addPermission')
  @UseGuards(JwtAuthGuard)
  addPermission(
    @Req() request: Request,
    @Body() name: string,
    @Body() permission: PermissionName,
  ) {
    return permissionGate(request, PermissionName.RoleAssignPermission, () =>
      this.rolesService.addPermission(name, permission),
    );
  }

  @Patch('removePermission')
  @UseGuards(JwtAuthGuard)
  removePermission(
    @Req() request: Request,
    @Body() name: string,
    @Body() permission: PermissionName,
  ) {
    return permissionGate(request, PermissionName.RoleCreate, () =>
      this.rolesService.removePermission(name, permission),
    );
  }
}
