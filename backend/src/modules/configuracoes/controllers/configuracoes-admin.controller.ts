import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ConfiguracoesService } from '../configuracoes.service';
import { AtualizarEscritorioDto, AtualizarPerfilDto, AlterarSenhaDto } from '../dto';

@ApiTags('Admin - Configurações')
@ApiBearerAuth()
@Controller('admin/configuracoes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConfiguracoesAdminController {
  constructor(private configuracoesService: ConfiguracoesService) {}

  // ==================== PERFIL ====================

  @Get('perfil')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO, TipoUsuario.COLABORADOR)
  @ApiOperation({ summary: 'Buscar perfil do usuário logado' })
  async buscarPerfil(@Req() req: any) {
    return this.configuracoesService.buscarPerfil(req.user.sub);
  }

  @Patch('perfil')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO, TipoUsuario.COLABORADOR)
  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  async atualizarPerfil(@Req() req: any, @Body() dto: AtualizarPerfilDto) {
    return this.configuracoesService.atualizarPerfil(req.user.sub, dto);
  }

  @Patch('perfil/senha')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO, TipoUsuario.COLABORADOR)
  @ApiOperation({ summary: 'Alterar senha' })
  async alterarSenha(@Req() req: any, @Body() dto: AlterarSenhaDto) {
    return this.configuracoesService.alterarSenha(req.user.sub, dto);
  }

  // ==================== ESCRITÓRIO ====================

  @Get('escritorio')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO)
  @ApiOperation({ summary: 'Buscar dados do escritório' })
  async buscarEscritorio(@Req() req: any) {
    return this.configuracoesService.buscarEscritorio(req.user.escritorioId);
  }

  @Patch('escritorio')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO)
  @ApiOperation({ summary: 'Atualizar dados do escritório' })
  async atualizarEscritorio(@Req() req: any, @Body() dto: AtualizarEscritorioDto) {
    return this.configuracoesService.atualizarEscritorio(req.user.escritorioId, dto);
  }

  // ==================== COLABORADORES ====================

  @Get('colaboradores')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO)
  @ApiOperation({ summary: 'Listar colaboradores do escritório' })
  async listarColaboradores(@Req() req: any) {
    return this.configuracoesService.listarColaboradores(req.user.escritorioId);
  }

  @Delete('colaboradores/:id')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO)
  @ApiOperation({ summary: 'Desativar colaborador' })
  async desativarColaborador(@Req() req: any, @Param('id') id: string) {
    return this.configuracoesService.desativarColaborador(id, req.user.escritorioId);
  }

  // ==================== SISTEMA ====================

  @Get('estatisticas')
  @Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO)
  @ApiOperation({ summary: 'Estatísticas do sistema' })
  async estatisticas() {
    return this.configuracoesService.estatisticasSistema();
  }
}
