import { CustomJwtPayload } from 'src/jwt/jwt-payload.type';

declare module 'express' {
  export interface Request {
    user?: CustomJwtPayload;
  }
}
