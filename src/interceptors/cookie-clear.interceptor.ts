import { ConfigService } from '@/app/common';
import { isDev } from '@/shared/helpers';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CookieClearInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        response.cookie(this.config.get('JWT_REFRESH_TOKEN_COOKIE_KEY'), '', {
          httpOnly: true,
          sameSite: 'strict',
          secure: !isDev(this.config.get('MODE')),
          expires: new Date(0),
        });

        response.cookie(this.config.get('COOKIE_DEVICE_KEY'), '', {
          httpOnly: true,
          sameSite: 'strict',
          secure: !isDev(this.config.get('MODE')),
          expires: new Date(0),
        });
      }),
    );
  }
}
