import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtRefreshTokenStrategy.extractJWTFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  private static extractJWTFromCookie(req: Request) {
    return req.cookies?.[process.env.JWT_REFRESH_TOKEN_COOKIE_KEY] || null;
  }

  async validate(payload) {
    return payload;
  }
}
