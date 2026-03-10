import { JwtPayload } from 'jsonwebtoken';

enum PermissionName {
  Viewer = 'viewer',
}

export interface CustomJwtPayload extends JwtPayload {
  permissions?: PermissionName[];
}
