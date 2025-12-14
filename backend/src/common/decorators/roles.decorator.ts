import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TipoUsuario, RoleEmpresa } from '@prisma/client';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';

export const ROLES_KEY = 'roles';
export const EMPRESA_ROLES_KEY = 'empresa_roles';

/**
 * Define quais tipos de usuário podem acessar o endpoint
 * 
 * @example
 * @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO)
 */
export const Roles = (...roles: TipoUsuario[]) =>
  SetMetadata(ROLES_KEY, roles);

/**
 * Define quais roles de empresa podem acessar o endpoint
 * 
 * @example
 * @EmpresaRoles(RoleEmpresa.PROPRIETARIO, RoleEmpresa.CONTADOR)
 */
export const EmpresaRoles = (...roles: RoleEmpresa[]) =>
  SetMetadata(EMPRESA_ROLES_KEY, roles);

/**
 * Combina autenticação JWT com verificação de roles
 * 
 * @example
 * @Auth(TipoUsuario.ADMIN_SISTEMA)
 */
export const Auth = (...roles: TipoUsuario[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth('JWT-auth'),
    ApiUnauthorizedResponse({ description: 'Não autorizado' }),
  );
};

/**
 * Marca endpoint como público (sem autenticação)
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
