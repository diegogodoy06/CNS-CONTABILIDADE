import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { TipoUsuario } from '@prisma/client';
import { TicketsService } from '../tickets.service';
import { CreateTicketDto, FiltroTicketsDto } from '../dto';

@ApiTags('Cliente - Tickets')
@ApiBearerAuth()
@Controller('cliente/tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.CLIENTE)
export class TicketsClienteController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post(':empresaId')
  @ApiOperation({ summary: 'Abre novo ticket' })
  @ApiParam({ name: 'empresaId', description: 'ID da empresa' })
  async criar(@Param('empresaId') empresaId: string, @Body() dto: CreateTicketDto, @Request() req: any) {
    return this.ticketsService.criarTicket(req.user.id, empresaId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista meus tickets' })
  async listar(@Request() req: any, @Query() filtros: FiltroTicketsDto) {
    return this.ticketsService.listarTicketsCliente(req.user.id, filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca ticket por ID' })
  async buscar(@Param('id') id: string, @Request() req: any) {
    return this.ticketsService.buscarTicket(id, req.user.id);
  }

  @Post(':id/mensagem')
  @ApiOperation({ summary: 'Envia mensagem no ticket' })
  async enviarMensagem(@Param('id') id: string, @Body('conteudo') conteudo: string, @Request() req: any) {
    return this.ticketsService.adicionarComentario(id, req.user.id, conteudo, false);
  }
}
