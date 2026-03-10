import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomJwtPayload, PermissionName } from 'src/jwt/jwt-payload.type';
import { Request } from 'express';

export const permissionGate = async <T>(
  request: Request,
  permissions: PermissionName | PermissionName[],
  fn: (userKey: string, user: CustomJwtPayload) => Promise<T>,
): Promise<T> => {
  if (
    request &&
    request.user &&
    request.user.sub &&
    (Array.isArray(permissions) ? permissions : [permissions]).every(
      (permission) => request.user?.permissions?.includes(permission),
    )
  ) {
    return await fn(request.user.sub, request.user);
  }

  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
};
