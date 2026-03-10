import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import express from 'express';
import { CustomJwtPayload } from './jwt-payload.type';
import { JwksService } from 'src/jwks/jwks.service';

function extractJWTfromCookie(request: express.Request): string | null {
  return request.cookies['access_token'] as string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(jwksService: JwksService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractJWTfromCookie,
      ]),

      secretOrKey: jwksService.getPublicPem(),
      algorithms: ['RS256'],
    });
  }

  validate(payload: CustomJwtPayload) {
    return payload;
  }
}
