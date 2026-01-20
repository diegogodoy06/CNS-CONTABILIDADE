import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TipoAcao } from '@prisma/client';
import { FiltroAuditoriaDto } from './dto';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registra log de auditoria
   */
  async registrarLog(
    usuarioId: string | null,
    acao: TipoAcao,
    tabela: string,
    registroId?: string,
    dadosAntigos?: any,
    dadosNovos?: any,
    ip?: string,
    userAgent?: string,
  ) {
    return this.prisma.log.create({
      data: {
        usuarioId,
        acao,
        tabela,
        registroId,
        dadosAntigos,
        dadosNovos,
        ip,
        userAgent,
      },
    });
  }

  /**
   * Lista logs de auditoria com filtros (Admin)
   */
  async listarLogs(filtros: FiltroAuditoriaDto) {
    const where: any = {};

    if (filtros.usuarioId) {
      where.usuarioId = filtros.usuarioId;
    }

    if (filtros.acao) {
      where.acao = filtros.acao as TipoAcao;
    }

    if (filtros.entidade) {
      where.tabela = filtros.entidade;
    }

    if (filtros.entidadeId) {
      where.registroId = filtros.entidadeId;
    }

    if (filtros.dataInicio || filtros.dataFim) {
      where.criadoEm = {};
      if (filtros.dataInicio) {
        where.criadoEm.gte = new Date(filtros.dataInicio);
      }
      if (filtros.dataFim) {
        where.criadoEm.lte = new Date(filtros.dataFim);
      }
    }

    const pagina = filtros.pagina || 1;
    const limite = filtros.limite || 50;

    const [logs, total] = await Promise.all([
      this.prisma.log.findMany({
        where,
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.log.count({ where }),
    ]);

    return {
      logs,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Busca log por ID
   */
  async buscarLog(logId: string) {
    return this.prisma.log.findUnique({
      where: { id: logId },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
      },
    });
  }

  /**
   * Estatísticas de auditoria
   */
  async estatisticas(dataInicio?: Date, dataFim?: Date) {
    const where: any = {};
    
    if (dataInicio || dataFim) {
      where.criadoEm = {};
      if (dataInicio) where.criadoEm.gte = dataInicio;
      if (dataFim) where.criadoEm.lte = dataFim;
    }

    const [totalLogs, acoesPorTipo] = await Promise.all([
      this.prisma.log.count({ where }),
      this.prisma.log.groupBy({
        by: ['acao'],
        where,
        _count: { acao: true },
        orderBy: { _count: { acao: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      totalLogs,
      acoesPorTipo: acoesPorTipo.map((a: any) => ({
        acao: a.acao,
        total: a._count.acao,
      })),
    };
  }

  /**
   * Logs de login do sistema
   */
  async logsLogin(pagina = 1, limite = 50) {
    const where = {
      acao: { in: [TipoAcao.LOGIN, TipoAcao.LOGOUT] },
    };

    const [logs, total] = await Promise.all([
      this.prisma.log.findMany({
        where,
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.log.count({ where }),
    ]);

    return { logs, total, pagina };
  }
}
