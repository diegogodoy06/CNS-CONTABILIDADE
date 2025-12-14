import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterDashboardDto } from './dto/filter-dashboard.dto';
import { Usuario, TipoUsuario, StatusNota, StatusGuia, StatusEmpresa } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna resumo geral do dashboard
   */
  async getResumo(dto: FilterDashboardDto, currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser, dto.empresaId);

    const [
      totalEmpresas,
      totalNotas,
      totalGuias,
      guiasVencidas,
      faturamentoMes,
    ] = await Promise.all([
      this.prisma.empresa.count({
        where: {
          id: { in: empresasIds },
          status: StatusEmpresa.ATIVA,
        },
      }),
      this.prisma.notaFiscal.count({
        where: {
          empresaId: { in: empresasIds },
          status: StatusNota.EMITIDA,
        },
      }),
      this.prisma.guia.count({
        where: {
          empresaId: { in: empresasIds },
          status: StatusGuia.PENDENTE,
        },
      }),
      this.prisma.guia.count({
        where: {
          empresaId: { in: empresasIds },
          status: StatusGuia.PENDENTE,
          dataVencimento: { lt: new Date() },
        },
      }),
      this.getFaturamentoMesAtual(empresasIds),
    ]);

    return {
      totalEmpresas,
      totalNotas,
      totalGuiasPendentes: totalGuias,
      guiasVencidas,
      faturamentoMes,
    };
  }

  /**
   * Retorna resumo financeiro
   */
  async getResumoFinanceiro(dto: FilterDashboardDto, currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser, dto.empresaId);
    const dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : this.getInicioAno();
    const dataFim = dto.dataFim ? new Date(dto.dataFim) : new Date();

    // Faturamento total
    const notas = await this.prisma.notaFiscal.findMany({
      where: {
        empresaId: { in: empresasIds },
        status: StatusNota.EMITIDA,
        dataEmissao: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      select: {
        valorServico: true,
        valorIss: true,
        valorLiquido: true,
      },
    });

    const faturamentoTotal = notas.reduce(
      (acc, n) => acc + Number(n.valorServico),
      0,
    );
    const impostosTotais = notas.reduce(
      (acc, n) => acc + Number(n.valorIss),
      0,
    );
    const liquidoTotal = notas.reduce(
      (acc, n) => acc + Number(n.valorLiquido),
      0,
    );

    // Guias pagas
    const guiasPagas = await this.prisma.guia.aggregate({
      where: {
        empresaId: { in: empresasIds },
        status: StatusGuia.PAGA,
        dataPagamento: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      _sum: {
        valorPago: true,
      },
    });

    // Guias pendentes
    const guiasPendentes = await this.prisma.guia.aggregate({
      where: {
        empresaId: { in: empresasIds },
        status: StatusGuia.PENDENTE,
      },
      _sum: {
        valor: true,
      },
    });

    return {
      periodo: {
        inicio: dataInicio,
        fim: dataFim,
      },
      faturamento: {
        bruto: this.round(faturamentoTotal),
        impostos: this.round(impostosTotais),
        liquido: this.round(liquidoTotal),
      },
      guias: {
        pagas: this.round(Number(guiasPagas._sum.valorPago || 0)),
        pendentes: this.round(Number(guiasPendentes._sum.valor || 0)),
      },
    };
  }

  /**
   * Retorna dados para gráfico de faturamento mensal
   */
  async getFaturamentoMensal(dto: FilterDashboardDto, currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser, dto.empresaId);
    
    const meses = 12;
    const resultado = [];
    const hoje = new Date();

    for (let i = meses - 1; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const inicioMes = new Date(data.getFullYear(), data.getMonth(), 1);
      const fimMes = new Date(data.getFullYear(), data.getMonth() + 1, 0);

      const notas = await this.prisma.notaFiscal.aggregate({
        where: {
          empresaId: { in: empresasIds },
          status: StatusNota.EMITIDA,
          competencia: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
        _sum: {
          valorServico: true,
        },
        _count: true,
      });

      resultado.push({
        mes: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`,
        label: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        valor: this.round(Number(notas._sum.valorServico || 0)),
        quantidade: notas._count,
      });
    }

    return resultado;
  }

  /**
   * Retorna alertas do sistema
   */
  async getAlertas(dto: FilterDashboardDto, currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser, dto.empresaId);
    const alertas = [];

    // Guias vencidas
    const guiasVencidas = await this.prisma.guia.findMany({
      where: {
        empresaId: { in: empresasIds },
        status: StatusGuia.PENDENTE,
        dataVencimento: { lt: new Date() },
      },
      include: {
        empresa: {
          select: { razaoSocial: true },
        },
      },
      orderBy: { dataVencimento: 'asc' },
      take: 5,
    });

    for (const guia of guiasVencidas) {
      alertas.push({
        tipo: 'GUIA_VENCIDA',
        prioridade: 'ALTA',
        titulo: `Guia vencida: ${guia.tipo}`,
        mensagem: `Empresa ${guia.empresa.razaoSocial} - Vencimento: ${guia.dataVencimento.toLocaleDateString('pt-BR')}`,
        referencia: {
          tipo: 'guia',
          id: guia.id,
        },
      });
    }

    // Guias próximas do vencimento (7 dias)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + 7);

    const guiasProximas = await this.prisma.guia.findMany({
      where: {
        empresaId: { in: empresasIds },
        status: StatusGuia.PENDENTE,
        dataVencimento: {
          gte: new Date(),
          lte: dataLimite,
        },
      },
      include: {
        empresa: {
          select: { razaoSocial: true },
        },
      },
      orderBy: { dataVencimento: 'asc' },
      take: 5,
    });

    for (const guia of guiasProximas) {
      alertas.push({
        tipo: 'GUIA_PROXIMA',
        prioridade: 'MEDIA',
        titulo: `Guia próxima do vencimento: ${guia.tipo}`,
        mensagem: `Empresa ${guia.empresa.razaoSocial} - Vencimento: ${guia.dataVencimento.toLocaleDateString('pt-BR')}`,
        referencia: {
          tipo: 'guia',
          id: guia.id,
        },
      });
    }

    // Notas em rascunho há mais de 7 dias
    const dataLimiteNotas = new Date();
    dataLimiteNotas.setDate(dataLimiteNotas.getDate() - 7);

    const notasRascunho = await this.prisma.notaFiscal.findMany({
      where: {
        empresaId: { in: empresasIds },
        status: StatusNota.RASCUNHO,
        criadoEm: { lt: dataLimiteNotas },
      },
      include: {
        empresa: {
          select: { razaoSocial: true },
        },
      },
      take: 5,
    });

    for (const nota of notasRascunho) {
      alertas.push({
        tipo: 'NOTA_RASCUNHO',
        prioridade: 'BAIXA',
        titulo: 'Nota fiscal pendente de emissão',
        mensagem: `Empresa ${nota.empresa.razaoSocial} - Criada em: ${nota.criadoEm.toLocaleDateString('pt-BR')}`,
        referencia: {
          tipo: 'nota',
          id: nota.id,
        },
      });
    }

    return alertas;
  }

  /**
   * Retorna ranking de empresas por faturamento
   */
  async getRankingEmpresas(dto: FilterDashboardDto, currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser, dto.empresaId);
    const dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : this.getInicioAno();
    const dataFim = dto.dataFim ? new Date(dto.dataFim) : new Date();

    const ranking = await this.prisma.notaFiscal.groupBy({
      by: ['empresaId'],
      where: {
        empresaId: { in: empresasIds },
        status: StatusNota.EMITIDA,
        dataEmissao: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      _sum: {
        valorServico: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          valorServico: 'desc',
        },
      },
      take: 10,
    });

    // Busca nomes das empresas
    const empresas = await this.prisma.empresa.findMany({
      where: {
        id: { in: ranking.map((r) => r.empresaId) },
      },
      select: {
        id: true,
        razaoSocial: true,
        nomeFantasia: true,
      },
    });

    const empresasMap = new Map(empresas.map((e) => [e.id, e]));

    return ranking.map((r, index) => {
      const empresa = empresasMap.get(r.empresaId);
      return {
        posicao: index + 1,
        empresaId: r.empresaId,
        razaoSocial: empresa?.razaoSocial,
        nomeFantasia: empresa?.nomeFantasia,
        faturamento: this.round(Number(r._sum.valorServico || 0)),
        quantidadeNotas: r._count,
      };
    });
  }

  /**
   * Retorna estatísticas por tipo de guia
   */
  async getEstatisticasGuias(dto: FilterDashboardDto, currentUser: Usuario) {
    const empresasIds = await this.getEmpresasAcessiveis(currentUser, dto.empresaId);

    const stats = await this.prisma.guia.groupBy({
      by: ['tipo', 'status'],
      where: {
        empresaId: { in: empresasIds },
      },
      _sum: {
        valor: true,
      },
      _count: true,
    });

    // Agrupa por tipo
    const porTipo: Record<string, any> = {};

    for (const stat of stats) {
      if (!porTipo[stat.tipo]) {
        porTipo[stat.tipo] = {
          tipo: stat.tipo,
          total: 0,
          totalValor: 0,
          pendentes: 0,
          valorPendente: 0,
          pagas: 0,
          valorPago: 0,
        };
      }

      porTipo[stat.tipo].total += stat._count;
      porTipo[stat.tipo].totalValor += Number(stat._sum.valor || 0);

      if (stat.status === StatusGuia.PENDENTE) {
        porTipo[stat.tipo].pendentes += stat._count;
        porTipo[stat.tipo].valorPendente += Number(stat._sum.valor || 0);
      } else if (stat.status === StatusGuia.PAGA) {
        porTipo[stat.tipo].pagas += stat._count;
        porTipo[stat.tipo].valorPago += Number(stat._sum.valor || 0);
      }
    }

    return Object.values(porTipo).map((item) => ({
      ...item,
      totalValor: this.round(item.totalValor),
      valorPendente: this.round(item.valorPendente),
      valorPago: this.round(item.valorPago),
    }));
  }

  /**
   * Calcula faturamento do mês atual
   */
  private async getFaturamentoMesAtual(empresasIds: string[]) {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const result = await this.prisma.notaFiscal.aggregate({
      where: {
        empresaId: { in: empresasIds },
        status: StatusNota.EMITIDA,
        dataEmissao: { gte: inicioMes },
      },
      _sum: {
        valorServico: true,
      },
    });

    return this.round(Number(result._sum.valorServico || 0));
  }

  /**
   * Retorna início do ano atual
   */
  private getInicioAno(): Date {
    const data = new Date();
    data.setMonth(0);
    data.setDate(1);
    data.setHours(0, 0, 0, 0);
    return data;
  }

  /**
   * Arredonda para 2 casas decimais
   */
  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Retorna IDs das empresas acessíveis
   */
  private async getEmpresasAcessiveis(
    user: Usuario,
    empresaId?: string,
  ): Promise<string[]> {
    // Se especificou empresa, verifica acesso
    if (empresaId) {
      await this.checkEmpresaAccess(empresaId, user);
      return [empresaId];
    }

    if (user.tipo === TipoUsuario.ADMIN_SISTEMA) {
      const empresas = await this.prisma.empresa.findMany({
        select: { id: true },
      });
      return empresas.map((e) => e.id);
    }

    if (user.tipo === TipoUsuario.CLIENTE) {
      const vinculos = await this.prisma.usuarioEmpresa.findMany({
        where: { usuarioId: user.id, ativo: true },
        select: { empresaId: true },
      });
      return vinculos.map((v) => v.empresaId);
    }

    const colaborador = await this.prisma.colaboradorEscritorio.findUnique({
      where: { usuarioId: user.id },
    });

    if (colaborador) {
      const empresas = await this.prisma.empresa.findMany({
        where: { escritorioId: colaborador.escritorioId },
        select: { id: true },
      });
      return empresas.map((e) => e.id);
    }

    return [];
  }

  /**
   * Verifica acesso à empresa
   */
  private async checkEmpresaAccess(empresaId: string, user: Usuario) {
    if (user.tipo === TipoUsuario.ADMIN_SISTEMA) {
      return;
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: {
        usuarios: {
          where: { usuarioId: user.id, ativo: true },
        },
        escritorio: {
          include: {
            colaboradores: {
              where: { usuarioId: user.id, ativo: true },
            },
          },
        },
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const hasAccess =
      empresa.usuarios.length > 0 ||
      empresa.escritorio.colaboradores.length > 0;

    if (!hasAccess) {
      throw new ForbiddenException('Sem acesso a esta empresa');
    }
  }
}
