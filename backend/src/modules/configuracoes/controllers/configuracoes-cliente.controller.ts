import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ConfiguracoesService } from '../configuracoes.service';
import { AtualizarPerfilDto, AlterarSenhaDto } from '../dto';

@ApiTags('Cliente - Configurações')
@ApiBearerAuth()
@Controller('cliente/configuracoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.CLIENTE)
export class ConfiguracoesClienteController {
  constructor(private configuracoesService: ConfiguracoesService) {}

  // ==================== PERFIL ====================

  @Get('perfil')
  @ApiOperation({ summary: 'Buscar perfil do cliente' })
  async buscarPerfil(@Req() req: any) {
    return this.configuracoesService.buscarPerfil(req.user.sub);
  }

  @Patch('perfil')
  @ApiOperation({ summary: 'Atualizar perfil do cliente' })
  async atualizarPerfil(@Req() req: any, @Body() dto: AtualizarPerfilDto) {
    return this.configuracoesService.atualizarPerfil(req.user.sub, dto);
  }

  @Patch('perfil/senha')
  @ApiOperation({ summary: 'Alterar senha do cliente' })
  async alterarSenha(@Req() req: any, @Body() dto: AlterarSenhaDto) {
    return this.configuracoesService.alterarSenha(req.user.sub, dto);
  }

  // ==================== EMPRESAS ====================

  @Get('empresas')
  @ApiOperation({ summary: 'Listar empresas vinculadas ao cliente' })
  async listarEmpresas(@Req() req: any) {
    return this.configuracoesService.listarEmpresasCliente(req.user.sub);
  }

  @Post('empresas/:empresaId/selecionar')
  @ApiOperation({ summary: 'Selecionar empresa ativa para operações' })
  async selecionarEmpresa(@Req() req: any, @Param('empresaId') empresaId: string) {
    return this.configuracoesService.selecionarEmpresa(req.user.sub, empresaId);
  }
}
