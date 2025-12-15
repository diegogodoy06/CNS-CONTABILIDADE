import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusNota, StatusGuia, StatusTicket } from '@prisma/client';
import { FiltroRelatorioDto, GerarRelatorioDto, TipoRelatorio } from './dto';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gera relatório de faturamento
   */
  async relatorioFaturamento(filtros: FiltroRelatorioDto) {
    const where: any = {
      dataEmissao: {
        gte: new Date(filtros.dataInicio),
        lte: new Date(filtros.dataFim),
      },
      status: StatusNota.EMITIDA,
    };

    if (filtros.empresaId) {
      where.empresaId = filtros.empresaId;
    }

    const notas = await this.prisma.notaFiscal.findMany({
      where,
      select: {
        id: true,
        numero: true,
        valorServico: true,
        valorLiquido: true,
        dataEmissao: true,
        empresa: { select: { razaoSocial: true } },
      },
      orderBy: { dataEmissao: 'asc' },
    });

    const totalFaturamento = notas.reduce(
      (acc, nota) => acc + Number(nota.valorServico || 0),
      0,
    );
    const totalLiquido = notas.reduce(
      (acc, nota) => acc + Number(nota.valorLiquido || 0),
      0,
    );

    return {
      periodo: { inicio: filtros.dataInicio, fim: filtros.dataFim },
      totalNotas: notas.length,
      totalFaturamento,
      totalLiquido,
      notas,
    };
  }

  /**
   * Gera relatório de impostos (guias)
   */
  async relatorioImpostos(filtros: FiltroRelatorioDto) {
    const where: any = {
      competencia: {
        gte: new Date(filtros.dataInicio),
        lte: new Date(filtros.dataFim),
      },
    };

    if (filtros.empresaId) {
      where.empresaId = filtros.empresaId;
    }

    const guias = await this.prisma.guia.findMany({
      where,
      select: {
        id: true,
        tipo: true,
        competencia: true,
        valor: true,
        valorPago: true,
        juros: true,
        multa: true,
        status: true,
        empresa: { select: { razaoSocial: true } },
      },
      orderBy: { competencia: 'asc' },
    });

    // Agrupamento por tipo de imposto
    const porTipo = guias.reduce((acc: any, guia) => {
      const tipo = guia.tipo;
      if (!acc[tipo]) {
        acc[tipo] = { quantidade: 0, valorTotal: 0 };
      }
      acc[tipo].quantidade++;
      const total = Number(guia.valor || 0) + Number(guia.juros || 0) + Number(guia.multa || 0);
      acc[tipo].valorTotal += total;
      return acc;
    }, {});

    const totalImpostos = guias.reduce(
      (acc, guia) => acc + Number(guia.valor || 0) + Number(guia.juros || 0) + Number(guia.multa || 0),
      0,
    );

    return {
      periodo: { inicio: filtros.dataInicio, fim: filtros.dataFim },
      totalGuias: guias.length,
      totalImpostos,
      porTipo,
      guias,
    };
  }

  /**
   * Gera relatório de notas emitidas
   */
  async relatorioNotasEmitidas(filtros: FiltroRelatorioDto) {
    const where: any = {
      dataEmissao: {
        gte: new Date(filtros.dataInicio),
        lte: new Date(filtros.dataFim),
      },
    };

    if (filtros.empresaId) {
      where.empresaId = filtros.empresaId;
    }

    const [notas, porStatus] = await Promise.all([
      this.prisma.notaFiscal.findMany({
        where,
        include: {
          empresa: { select: { razaoSocial: true } },
          tomador: { select: { razaoSocial: true } },
        },
        orderBy: { dataEmissao: 'desc' },
      }),
      this.prisma.notaFiscal.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
        _sum: { valorServico: true },
      }),
    ]);

    return {
      periodo: { inicio: filtros.dataInicio, fim: filtros.dataFim },
      totalNotas: notas.length,
      porStatus: porStatus.map((s) => ({
        status: s.status,
        quantidade: s._count.id,
        valor: s._sum.valorServico,
      })),
      notas,
    };
  }

  /**
   * Gera relatório de guias
   */
  async relatorioGuias(filtros: FiltroRelatorioDto) {
    const where: any = {
      competencia: {
        gte: new Date(filtros.dataInicio),
        lte: new Date(filtros.dataFim),
      },
    };

    if (filtros.empresaId) {
      where.empresaId = filtros.empresaId;
    }

    const [guias, porStatus] = await Promise.all([
      this.prisma.guia.findMany({
        where,
        include: {
          empresa: { select: { razaoSocial: true } },
        },
        orderBy: { competencia: 'desc' },
      }),
      this.prisma.guia.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
        _sum: { valor: true },
      }),
    ]);

    return {
      periodo: { inicio: filtros.dataInicio, fim: filtros.dataFim },
      totalGuias: guias.length,
      porStatus: porStatus.map((s) => ({
        status: s.status,
        quantidade: s._count.id,
        valor: s._sum.valor,
      })),
      guias,
    };
  }

  /**
   * Dashboard consolidado para Admin
   */
  async dashboardAdmin() {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const [
      totalEmpresas,
      totalUsuarios,
      notasMes,
      guiasMes,
      ticketsAbertos,
    ] = await Promise.all([
      this.prisma.empresa.count({ where: { status: 'ATIVA' } }),
      this.prisma.usuario.count({ where: { status: 'ATIVO' } }),
      this.prisma.notaFiscal.count({
        where: {
          dataEmissao: { gte: inicioMes, lte: fimMes },
          status: StatusNota.EMITIDA,
        },
      }),
      this.prisma.guia.count({
        where: {
          competencia: { gte: inicioMes, lte: fimMes },
        },
      }),
      this.prisma.ticket.count({
        where: { status: { in: [StatusTicket.ABERTO, StatusTicket.EM_ANDAMENTO] } },
      }),
    ]);

    return {
      totalEmpresas,
      totalUsuarios,
      notasMes,
      guiasMes,
      ticketsAbertos,
      periodo: { inicio: inicioMes, fim: fimMes },
    };
  }

  /**
   * Dashboard para Cliente (empresa específica)
   */
  async dashboardCliente(empresaId: string) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const [
      notasMes,
      faturamentoMes,
      guiasPendentes,
      documentosRecentes,
    ] = await Promise.all([
      this.prisma.notaFiscal.count({
        where: {
          empresaId,
          dataEmissao: { gte: inicioMes, lte: fimMes },
          status: StatusNota.EMITIDA,
        },
      }),
      this.prisma.notaFiscal.aggregate({
        where: {
          empresaId,
          dataEmissao: { gte: inicioMes, lte: fimMes },
          status: StatusNota.EMITIDA,
        },
        _sum: { valorServico: true },
      }),
      this.prisma.guia.count({
        where: {
          empresaId,
          status: { in: [StatusGuia.PENDENTE] },
        },
      }),
      this.prisma.documento.count({
        where: {
          empresaId,
          criadoEm: { gte: inicioMes },
        },
      }),
    ]);

    return {
      notasMes,
      faturamentoMes: faturamentoMes._sum.valorServico || 0,
      guiasPendentes,
      documentosRecentes,
      periodo: { inicio: inicioMes, fim: fimMes },
    };
  }

  /**
   * Gera relatório baseado no tipo
   */
  async gerarRelatorio(dto: GerarRelatorioDto) {
    const filtros: FiltroRelatorioDto = {
      dataInicio: dto.dataInicio,
      dataFim: dto.dataFim,
      empresaId: dto.empresaId,
    };

    switch (dto.tipo) {
      case TipoRelatorio.FATURAMENTO:
        return this.relatorioFaturamento(filtros);
      case TipoRelatorio.IMPOSTOS:
        return this.relatorioImpostos(filtros);
      case TipoRelatorio.NOTAS_EMITIDAS:
        return this.relatorioNotasEmitidas(filtros);
      case TipoRelatorio.GUIAS_GERADAS:
        return this.relatorioGuias(filtros);
      default:
        throw new Error('Tipo de relatório não suportado');
    }
  }
}
