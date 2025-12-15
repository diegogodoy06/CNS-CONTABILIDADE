import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ComunicacaoService } from '../comunicacao.service';
import { EnviarMensagemDto, FiltroMensagensDto } from '../dto';

@ApiTags('Cliente - Comunicação')
@ApiBearerAuth()
@Controller('cliente/comunicacao')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.CLIENTE)
export class ComunicacaoClienteController {
  constructor(private comunicacaoService: ComunicacaoService) {}

  @Post('mensagens')
  @ApiOperation({ summary: 'Enviar mensagem para o escritório' })
  async enviarMensagem(@Req() req: any, @Body() dto: EnviarMensagemDto) {
    return this.comunicacaoService.enviarMensagem(req.user.sub, dto);
  }

  @Get('mensagens/enviadas')
  @ApiOperation({ summary: 'Listar mensagens enviadas' })
  async listarEnviadas(@Req() req: any, @Query() filtros: FiltroMensagensDto) {
    return this.comunicacaoService.listarMensagensEnviadas(req.user.sub, filtros);
  }

  @Get('mensagens/recebidas')
  @ApiOperation({ summary: 'Listar mensagens recebidas' })
  async listarRecebidas(@Req() req: any, @Query() filtros: FiltroMensagensDto) {
    return this.comunicacaoService.listarMensagensRecebidas(req.user.sub, filtros);
  }

  @Get('mensagens/nao-lidas/count')
  @ApiOperation({ summary: 'Contar mensagens não lidas' })
  async contarNaoLidas(@Req() req: any) {
    const count = await this.comunicacaoService.contarNaoLidas(req.user.sub);
    return { count };
  }

  @Get('mensagens/:id')
  @ApiOperation({ summary: 'Visualizar mensagem (marca como lida)' })
  async visualizarMensagem(@Req() req: any, @Param('id') id: string) {
    return this.comunicacaoService.buscarMensagem(id, req.user.sub);
  }

  @Patch('mensagens/:id/arquivar')
  @ApiOperation({ summary: 'Arquivar mensagem' })
  async arquivarMensagem(@Req() req: any, @Param('id') id: string) {
    return this.comunicacaoService.arquivarMensagem(id, req.user.sub);
  }

  @Get('notificacoes')
  @ApiOperation({ summary: 'Listar notificações' })
  async listarNotificacoes(@Req() req: any, @Query('limite') limite?: number) {
    return this.comunicacaoService.listarNotificacoes(req.user.sub, limite);
  }

  @Patch('notificacoes/:id/lida')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  async marcarLida(@Req() req: any, @Param('id') id: string) {
    return this.comunicacaoService.marcarNotificacaoLida(id, req.user.sub);
  }
}
