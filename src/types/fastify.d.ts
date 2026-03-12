import { CustomJwtPayload } from 'src/jwt/jwt-payload.type';

declare module 'fastify' {
  export interface FastifyRequest {
    user?: CustomJwtPayload;
  }
}
