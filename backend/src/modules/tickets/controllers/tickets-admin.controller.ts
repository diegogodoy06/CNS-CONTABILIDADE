import { Controller, Get, Post, Put, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { TipoUsuario } from '@prisma/client';
import { TicketsService } from '../tickets.service';
import { ResponderTicketDto, AtribuirTicketDto, FiltroTicketsDto } from '../dto';

@ApiTags('Admin - Tickets')
@ApiBearerAuth()
@Controller('admin/tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN_SISTEMA, TipoUsuario.ADMIN_ESCRITORIO, TipoUsuario.COLABORADOR)
export class TicketsAdminController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os tickets do escritório' })
  async listar(@Request() req: any, @Query() filtros: FiltroTicketsDto) {
    return this.ticketsService.listarTicketsAdmin(req.user.escritorioId, filtros);
  }

  @Get('metricas')
  @ApiOperation({ summary: 'Métricas de SLA' })
  async metricas(@Request() req: any) {
    return this.ticketsService.metricasSLA(req.user.escritorioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca ticket por ID' })
  async buscar(@Param('id') id: string, @Request() req: any) {
    return this.ticketsService.buscarTicket(id, undefined, req.user.escritorioId);
  }

  @Post(':id/responder')
  @ApiOperation({ summary: 'Responde ao ticket' })
  async responder(@Param('id') id: string, @Body() dto: ResponderTicketDto, @Request() req: any) {
    return this.ticketsService.responderTicket(id, req.user.id, dto);
  }

  @Put(':id/atribuir')
  @ApiOperation({ summary: 'Atribui ticket a colaborador' })
  async atribuir(@Param('id') id: string, @Body() dto: AtribuirTicketDto) {
    return this.ticketsService.atribuirTicket(id, dto);
  }

  @Put(':id/fechar')
  @ApiOperation({ summary: 'Fecha o ticket' })
  async fechar(@Param('id') id: string) {
    return this.ticketsService.fecharTicket(id);
  }
}
