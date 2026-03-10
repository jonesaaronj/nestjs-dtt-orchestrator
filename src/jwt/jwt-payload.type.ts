import { JwtPayload } from 'jsonwebtoken';

export enum PermissionName {
  Viewer = 'viewer',
  TrackerRegister = 'tracker:register',
  TrackerDelete = 'tracker:delete',
  TrackerList = 'tracker:list',
}

export interface CustomJwtPayload extends JwtPayload {
  permissions?: PermissionName[];
}
