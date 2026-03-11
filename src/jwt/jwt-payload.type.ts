import { JwtPayload } from 'jsonwebtoken';

export enum PermissionName {
  Viewer = 'viewer',

  TrackerRegister = 'tracker:register',
  TrackerRemove = 'tracker:remove',
  TrackerList = 'tracker:list',

  TorrentRegister = 'torrent:register',
  TorrentRemove = 'torrent:remove',
  TorrentList = 'torrent:list',

  UserAssignRole = 'user:assign:role',

  RoleList = 'role:list',
  RoleCreate = 'role:create',
  RoleRemove = 'role:remove',
  RoleAssignPermission = 'role:assign:permission',
}

export interface CustomJwtPayload extends JwtPayload {
  permissions?: PermissionName[];
}
