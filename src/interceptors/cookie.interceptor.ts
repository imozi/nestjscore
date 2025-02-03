import { ConfigService } from '@/app/common';
import { getExpiryDay, isDev } from '@/shared/helpers';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (data && data.refreshToken && data.deviceId) {
          response.cookie(this.config.get('JWT_REFRESH_TOKEN_COOKIE_KEY'), data.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: !isDev(this.config.get('MODE')),
            expires: getExpiryDay(this.config.get('JWT_REFRESH_TOKEN_AND_DEVICE_KEY_EXPIRES_IN')),
          });

          response.cookie(this.config.get('COOKIE_DEVICE_KEY'), data.deviceId, {
            httpOnly: true,
            sameSite: 'strict',
            secure: !isDev(this.config.get('MODE')),
            expires: getExpiryDay(this.config.get('JWT_REFRESH_TOKEN_AND_DEVICE_KEY_EXPIRES_IN')),
          });

          delete data.refreshToken;
          delete data.deviceId;

          return data;
        }
      }),
    );
  }
}
