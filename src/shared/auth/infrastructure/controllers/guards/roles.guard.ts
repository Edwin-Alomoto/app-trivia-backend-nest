import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@MR_CHANGO/shared/auth/infrastructure/controllers/decorators/roles.decorator';
import { UserRole } from '../enums/user-roles.enum';
import { CurrentUser } from '../interface/current-user.interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permite el acceso
    }

    const { user }: { user: CurrentUser } = context.switchToHttp().getRequest();

    if (!user) {
      return false; // No hay usuario autenticado
    }

    if (!user.role) {
      return false; // El usuario no tiene rol asignado
    }

    // Verificar si el rol del usuario está en los roles requeridos
    return requiredRoles.includes(user.role);
  }
}
