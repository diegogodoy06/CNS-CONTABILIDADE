import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { TipoUsuario } from '@prisma/client';

/**
 * Guard que verifica se o usuário tem o tipo/role necessário para acessar a rota
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<TipoUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não houver roles definidas, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const tipoUsuario = user.tipo;

    // ADMIN_SISTEMA tem acesso a tudo
    if (tipoUsuario === TipoUsuario.ADMIN_SISTEMA) {
      return true;
    }

    const hasRole = requiredRoles.some(role => role === tipoUsuario);
    
    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Seu perfil (${tipoUsuario}) não tem permissão para acessar este recurso.`
      );
    }

    return true;
  }
}
