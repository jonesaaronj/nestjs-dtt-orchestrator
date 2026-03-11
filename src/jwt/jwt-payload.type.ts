import { JwtPayload } from 'jsonwebtoken';

export enum PermissionName {
  Viewer = 'viewer',

  TrackerRegister = 'tracker:register',
  TrackerDelete = 'tracker:delete',
  TrackerList = 'tracker:list',

  UserAssignRole = 'user:assign:role',

  RoleList = 'role:list',
  RoleCreate = 'role:create',
  RoleRemove = 'role:remove',
  RoleAssignPermission = 'role:assign:permission',
}

export interface CustomJwtPayload extends JwtPayload {
  permissions?: PermissionName[];
}
