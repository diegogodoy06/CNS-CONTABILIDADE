import api from './api';

export interface RelatorioDashboard {
  faturamentoTotal: number;
  faturamentoMesAnterior: number;
  variacaoFaturamento: number;
  impostosTotal: number;
  impostosMesAnterior: number;
  variacaoImpostos: number;
  notasEmitidas: number;
  notasMesAnterior: number;
  variacaoNotas: number;
  guiasPendentes: number;
  guiasVencidas: number;
}

export interface RelatorioFaturamento {
  periodo: string;
  valorTotal: number;
  notasEmitidas: number;
  porTomador: {
    tomadorId: string;
    razaoSocial: string;
    valor: number;
    quantidade: number;
  }[];
  porServico: {
    descricao: string;
    cnae: string;
    valor: number;
    quantidade: number;
  }[];
}

export interface RelatorioImpostos {
  periodo: string;
  totalImpostos: number;
  totalPago: number;
  totalPendente: number;
  porTipo: {
    tipo: string;
    valor: number;
    pago: number;
    pendente: number;
  }[];
  porMes: {
    mes: string;
    valor: number;
    pago: number;
  }[];
}

export interface RelatorioNotasEmitidas {
  periodo: string;
  total: number;
  valorTotal: number;
  porStatus: {
    status: string;
    quantidade: number;
    valor: number;
  }[];
  porMes: {
    mes: string;
    quantidade: number;
    valor: number;
  }[];
  notas: {
    id: string;
    numero: number;
    tomador: string;
    valor: number;
    dataEmissao: string;
    status: string;
  }[];
}

export interface RelatorioGuias {
  periodo: string;
  totalGuias: number;
  valorTotal: number;
  pagas: number;
  pendentes: number;
  vencidas: number;
  porTipo: {
    tipo: string;
    quantidade: number;
    valor: number;
    pago: number;
  }[];
  guias: {
    id: string;
    tipo: string;
    competencia: string;
    valor: number;
    vencimento: string;
    status: string;
  }[];
}

interface FilterParams {
  empresaId?: string;
  dataInicio?: string;
  dataFim?: string;
  competencia?: string;
}

const relatoriosService = {
  /**
   * Obtém dados do dashboard de relatórios
   */
  async getDashboard(params?: FilterParams): Promise<RelatorioDashboard> {
    const response = await api.get('/cliente/relatorios/dashboard', { params });
    return response.data.data;
  },

  /**
   * Obtém relatório de faturamento
   */
  async getFaturamento(params?: FilterParams): Promise<RelatorioFaturamento> {
    const response = await api.get('/cliente/relatorios/faturamento', { params });
    return response.data.data;
  },

  /**
   * Obtém relatório de impostos
   */
  async getImpostos(params?: FilterParams): Promise<RelatorioImpostos> {
    const response = await api.get('/cliente/relatorios/impostos', { params });
    return response.data.data;
  },

  /**
   * Obtém relatório de notas emitidas
   */
  async getNotasEmitidas(params?: FilterParams): Promise<RelatorioNotasEmitidas> {
    const response = await api.get('/cliente/relatorios/notas-emitidas', { params });
    return response.data.data;
  },

  /**
   * Obtém relatório de guias
   */
  async getGuias(params?: FilterParams): Promise<RelatorioGuias> {
    const response = await api.get('/cliente/relatorios/guias', { params });
    return response.data.data;
  },

  /**
   * Exporta relatório em formato específico
   */
  async exportar(
    tipo: 'faturamento' | 'impostos' | 'notas' | 'guias',
    formato: 'pdf' | 'excel' | 'csv',
    params?: FilterParams
  ): Promise<Blob> {
    const response = await api.get(`/cliente/relatorios/${tipo}/exportar`, {
      params: { ...params, formato },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default relatoriosService;
