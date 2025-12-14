import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '@prisma/client';

/**
 * Decorator para obter o usuário autenticado da requisição
 * 
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: Usuario) {
 *   return user;
 * }
 * 
 * @Get('profile')
 * getProfile(@CurrentUser('id') userId: string) {
 *   return userId;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof Usuario | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as Usuario;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
