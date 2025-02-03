import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = randomUUID();
    const request = context.switchToHttp().getRequest();
    const { headers } = request;

    headers['x-request-id'] = requestId;

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        response.setHeader('x-request-id', requestId);
      }),
    );
  }
}
