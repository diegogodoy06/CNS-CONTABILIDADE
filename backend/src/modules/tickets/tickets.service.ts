import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto, ResponderTicketDto, AtribuirTicketDto, FiltroTicketsDto } from './dto';
import { StatusTicket, PrioridadeTicket } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria novo ticket (Cliente)
   */
  async criarTicket(usuarioId: string, empresaId: string, dto: CreateTicketDto) {
    // Verificar acesso à empresa
    const acesso = await this.prisma.usuarioEmpresa.findFirst({
      where: { usuarioId, empresaId, ativo: true },
    });

    if (!acesso) {
      throw new ForbiddenException('Você não tem acesso a esta empresa');
    }

    // Calcular prazo de resposta
    const prazoHoras = {
      [PrioridadeTicket.URGENTE]: 4,
      [PrioridadeTicket.ALTA]: 8,
      [PrioridadeTicket.MEDIA]: 24,
      [PrioridadeTicket.BAIXA]: 48,
    };
    const prazoResposta = new Date();
    prazoResposta.setHours(prazoResposta.getHours() + prazoHoras[dto.prioridade || PrioridadeTicket.MEDIA]);

    const ticket = await this.prisma.ticket.create({
      data: {
        empresaId,
        criadorId: usuarioId,
        titulo: dto.titulo,
        descricao: dto.descricao,
        categoria: dto.categoria,
        prioridade: dto.prioridade || PrioridadeTicket.MEDIA,
        status: StatusTicket.ABERTO,
        prazoResposta,
      },
      include: {
        criador: { select: { id: true, nome: true, email: true } },
        empresa: { select: { id: true, razaoSocial: true } },
      },
    });

    return ticket;
  }

  /**
   * Lista tickets do cliente
   */
  async listarTicketsCliente(usuarioId: string, filtros: FiltroTicketsDto) {
    const empresasUsuario = await this.prisma.usuarioEmpresa.findMany({
      where: { usuarioId, ativo: true },
      select: { empresaId: true },
    });

    const empresaIds = empresasUsuario.map((e: any) => e.empresaId);

    const where: any = { empresaId: { in: empresaIds } };
    if (filtros.status) where.status = filtros.status;
    if (filtros.prioridade) where.prioridade = filtros.prioridade;

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        include: {
          empresa: { select: { razaoSocial: true } },
          criador: { select: { nome: true } },
          _count: { select: { comentarios: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: filtros.pagina ? (filtros.pagina - 1) * (filtros.limite || 20) : 0,
        take: filtros.limite || 20,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return { tickets, total, pagina: filtros.pagina || 1 };
  }

  /**
   * Busca ticket por ID
   */
  async buscarTicket(ticketId: string, usuarioId?: string, escritorioId?: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        criador: { select: { id: true, nome: true, email: true } },
        atribuido: { select: { id: true, nome: true, email: true } },
        empresa: { select: { id: true, razaoSocial: true, escritorioId: true } },
        comentarios: {
          include: { usuario: { select: { id: true, nome: true } } },
          orderBy: { criadoEm: 'asc' },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket não encontrado');

    // Verificar acesso
    if (escritorioId && ticket.empresa.escritorioId !== escritorioId) {
      throw new ForbiddenException('Ticket não pertence a este escritório');
    }

    if (usuarioId) {
      const acesso = await this.prisma.usuarioEmpresa.findFirst({
        where: { usuarioId, empresaId: ticket.empresaId, ativo: true },
      });
      if (!acesso) throw new ForbiddenException('Você não tem acesso a este ticket');
    }

    return ticket;
  }

  /**
   * Adiciona comentário ao ticket
   */
  async adicionarComentario(ticketId: string, usuarioId: string, conteudo: string, interno = false) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Ticket não encontrado');

    const comentario = await this.prisma.ticketComentario.create({
      data: { ticketId, usuarioId, conteudo, interno },
      include: { usuario: { select: { nome: true } } },
    });

    // Atualizar status se necessário
    if (ticket.status === StatusTicket.AGUARDANDO_CLIENTE) {
      await this.prisma.ticket.update({
        where: { id: ticketId },
        data: { status: StatusTicket.EM_ANDAMENTO },
      });
    }

    return comentario;
  }

  /**
   * Lista tickets do escritório (Admin)
   */
  async listarTicketsAdmin(escritorioId: string, filtros: FiltroTicketsDto) {
    const where: any = { empresa: { escritorioId } };
    if (filtros.status) where.status = filtros.status;
    if (filtros.prioridade) where.prioridade = filtros.prioridade;
    if (filtros.empresaId) where.empresaId = filtros.empresaId;

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        include: {
          empresa: { select: { razaoSocial: true, cnpj: true } },
          criador: { select: { nome: true } },
          atribuido: { select: { nome: true } },
          _count: { select: { comentarios: true } },
        },
        orderBy: [{ prioridade: 'desc' }, { criadoEm: 'desc' }],
        skip: filtros.pagina ? (filtros.pagina - 1) * (filtros.limite || 20) : 0,
        take: filtros.limite || 20,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return { tickets, total, pagina: filtros.pagina || 1 };
  }

  /**
   * Responde ticket (Admin)
   */
  async responderTicket(ticketId: string, usuarioId: string, dto: ResponderTicketDto) {
    const comentario = await this.prisma.ticketComentario.create({
      data: {
        ticketId,
        usuarioId,
        conteudo: dto.conteudo,
        interno: dto.interno || false,
      },
      include: { usuario: { select: { nome: true } } },
    });

    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: StatusTicket.EM_ANDAMENTO },
    });

    return comentario;
  }

  /**
   * Atribui ticket
   */
  async atribuirTicket(ticketId: string, dto: AtribuirTicketDto) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        atribuidoId: dto.colaboradorId,
        status: StatusTicket.EM_ANDAMENTO,
      },
      include: { atribuido: { select: { id: true, nome: true } } },
    });
  }

  /**
   * Fecha ticket
   */
  async fecharTicket(ticketId: string) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: StatusTicket.FECHADO, fechadoEm: new Date() },
    });
  }

  /**
   * Métricas SLA
   */
  async metricasSLA(escritorioId: string) {
    const base = { empresa: { escritorioId } };

    const [abertos, emAndamento, fechados, atrasados] = await Promise.all([
      this.prisma.ticket.count({ where: { ...base, status: StatusTicket.ABERTO } }),
      this.prisma.ticket.count({ where: { ...base, status: StatusTicket.EM_ANDAMENTO } }),
      this.prisma.ticket.count({ where: { ...base, status: StatusTicket.FECHADO } }),
      this.prisma.ticket.count({
        where: {
          ...base,
          status: { notIn: [StatusTicket.FECHADO, StatusTicket.RESOLVIDO] },
          prazoResposta: { lt: new Date() },
        },
      }),
    ]);

    return { abertos, emAndamento, fechados, atrasados };
  }
}
