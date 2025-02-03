import { ROLES_KEY } from '@/decorators/roles.decorator';
import { RequestWithAccessTokenPayload } from '@/shared/core/interfaces';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as RequestWithAccessTokenPayload;

    if (!request.user) {
      throw new UnauthorizedException('Пользователь не найден!');
    }

    return requiredRoles.some((role) => request.user.roles?.includes(role));
  }
}
