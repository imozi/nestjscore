import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { LoggerService } from '@/app/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    this.logger.http(request, response, context.getClass().name);

    return next.handle();
  }
}
