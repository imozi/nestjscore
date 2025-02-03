import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { deviceInfo } from '@/shared/helpers';

export const DeviceMeta = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return deviceInfo(req);
});
