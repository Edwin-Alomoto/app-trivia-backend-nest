import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@MR_CHANGO/shared/auth/infrastructure/controllers/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permite el acceso
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false; // No hay usuario autenticado
    }

    if (!user.roles || !Array.isArray(user.roles)) {
      return false; // El usuario no tiene roles
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
