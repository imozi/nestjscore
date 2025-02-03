import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, RefreshTokenPayload } from '@/shared/core/interfaces';

@Injectable()
export class JWTService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async generateAccessToken(payload: AccessTokenPayload) {
    return await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  async generateRefreshToken(payload: RefreshTokenPayload) {
    return await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_AND_DEVICE_KEY_EXPIRES_IN'),
    });
  }
}
