import api from './api';
import type { DashboardStats } from '../types';

export interface DashboardResumoResponse {
  notasEmitidas: {
    total: number;
    variacao: number;
  };
  faturamento: {
    total: number;
    variacao: number;
  };
  pendencias: {
    guias: number;
    documentos: number;
    total: number;
  };
  proximasObrigacoes: unknown[];
  notasRecentes: unknown[];
  documentosRecentes: unknown[];
}

export interface DashboardFinanceiroResponse {
  totalImpostos: number;
  totalPago: number;
  totalPendente: number;
  proximoVencimento: string | null;
  guiasPorStatus: {
    pendentes: number;
    vencidas: number;
    pagas: number;
  };
}

export interface FaturamentoMensalResponse {
  mes: string;
  faturamento: number;
  impostos: number;
  notasEmitidas: number;
}

export interface AlertaResponse {
  id: string;
  tipo: 'critica' | 'importante' | 'informativa';
  titulo: string;
  mensagem: string;
  dataEnvio: string;
  link?: string;
}

export interface RankingEmpresaResponse {
  empresaId: string;
  razaoSocial: string;
  faturamento: number;
  notasEmitidas: number;
}

export interface EstatisticasGuiasResponse {
  tipo: string;
  total: number;
  valorTotal: number;
  pagas: number;
  pendentes: number;
  vencidas: number;
}

interface FilterParams {
  empresaId?: string;
  dataInicio?: string;
  dataFim?: string;
}

const dashboardService = {
  /**
   * Obtém o resumo geral do dashboard
   */
  async getResumo(params?: FilterParams): Promise<DashboardStats> {
    const response = await api.get('/dashboard/resumo', { params });
    return response.data.data;
  },

  /**
   * Obtém resumo financeiro
   */
  async getFinanceiro(params?: FilterParams): Promise<DashboardFinanceiroResponse> {
    const response = await api.get('/dashboard/financeiro', { params });
    return response.data.data;
  },

  /**
   * Obtém faturamento mensal (últimos 12 meses)
   */
  async getFaturamentoMensal(params?: FilterParams): Promise<FaturamentoMensalResponse[]> {
    const response = await api.get('/dashboard/faturamento-mensal', { params });
    return response.data.data;
  },

  /**
   * Obtém alertas do sistema
   */
  async getAlertas(params?: FilterParams): Promise<AlertaResponse[]> {
    const response = await api.get('/dashboard/alertas', { params });
    return response.data.data;
  },

  /**
   * Obtém ranking de empresas por faturamento
   */
  async getRankingEmpresas(params?: FilterParams): Promise<RankingEmpresaResponse[]> {
    const response = await api.get('/dashboard/ranking-empresas', { params });
    return response.data.data;
  },

  /**
   * Obtém estatísticas de guias por tipo
   */
  async getEstatisticasGuias(params?: FilterParams): Promise<EstatisticasGuiasResponse[]> {
    const response = await api.get('/dashboard/estatisticas-guias', { params });
    return response.data.data;
  },
};

export default dashboardService;
