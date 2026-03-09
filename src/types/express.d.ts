import { JwtPayload } from 'src/auth/jwt-payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
