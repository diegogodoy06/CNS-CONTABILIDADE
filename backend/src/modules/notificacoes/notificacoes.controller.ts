import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { FilterNotificacaoDto, MarcarLidaDto } from './dto/filter-notificacao.dto';
import { UpdateConfiguracoesDto } from './dto/configuracao-notificacao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('Notificações')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'notificacoes',
  version: '1',
})
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova notificação' })
  @ApiResponse({ status: 201, description: 'Notificação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() dto: CreateNotificacaoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notificacoesService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notificações do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de notificações paginada' })
  findAll(
    @Query() dto: FilterNotificacaoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notificacoesService.findAll(dto, user);
  }

  @Get('count')
  @ApiOperation({ summary: 'Contar notificações não lidas' })
  @ApiResponse({ status: 200, description: 'Contagem de notificações não lidas' })
  countNaoLidas(@CurrentUser() user: Usuario) {
    return this.notificacoesService.countNaoLidas(user);
  }

  @Get('configuracoes')
  @ApiOperation({ summary: 'Obter configurações de notificação' })
  @ApiResponse({ status: 200, description: 'Configurações de notificação' })
  getConfiguracoes(@CurrentUser() user: Usuario) {
    return this.notificacoesService.getConfiguracoes(user);
  }

  @Post('configuracoes')
  @ApiOperation({ summary: 'Atualizar configurações de notificação' })
  @ApiResponse({ status: 200, description: 'Configurações atualizadas' })
  updateConfiguracoes(
    @Body() dto: UpdateConfiguracoesDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notificacoesService.updateConfiguracoes(dto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar notificação por ID' })
  @ApiResponse({ status: 200, description: 'Dados da notificação' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.notificacoesService.findOne(id, user);
  }

  @Post('marcar-lida')
  @ApiOperation({ summary: 'Marcar notificações como lidas' })
  @ApiResponse({ status: 200, description: 'Notificações marcadas como lidas' })
  marcarComoLida(
    @Body() dto: MarcarLidaDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.notificacoesService.marcarComoLida(dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover notificação' })
  @ApiResponse({ status: 200, description: 'Notificação removida' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    return this.notificacoesService.remove(id, user);
  }
}
