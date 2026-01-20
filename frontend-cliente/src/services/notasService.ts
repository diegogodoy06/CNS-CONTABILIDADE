import api from './api';
import type { NotaFiscal, NotaFiscalFilters, ServicoNF, ValoresNF } from '../types';

export interface PaginatedNotas {
  items: NotaFiscal[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateNotaFiscalDto {
  empresaId: string;
  tomadorId: string;
  tipo: 'nfse' | 'nfe';
  servico: ServicoNF;
  valores: Omit<ValoresNF, 'baseCalculo' | 'valorLiquido'>;
  dataCompetencia: string;
  localPrestacao: {
    municipio: string;
    uf: string;
    codigoMunicipio: string;
  };
  observacoes?: string;
  retencoes?: {
    ir: boolean;
    pis: boolean;
    cofins: boolean;
    csll: boolean;
    inss: boolean;
  };
}

export interface UpdateNotaFiscalDto {
  tomadorId?: string;
  servico?: ServicoNF;
  valores?: Omit<ValoresNF, 'baseCalculo' | 'valorLiquido'>;
  dataCompetencia?: string;
  localPrestacao?: {
    municipio: string;
    uf: string;
    codigoMunicipio: string;
  };
  observacoes?: string;
  retencoes?: {
    ir: boolean;
    pis: boolean;
    cofins: boolean;
    csll: boolean;
    inss: boolean;
  };
}

export interface CancelarNotaFiscalDto {
  motivo: string;
}

export interface NotaFiscalStats {
  totalEmitidas: number;
  totalRascunhos: number;
  faturamentoMes: number;
  variacao: number;
}

interface FilterParams extends NotaFiscalFilters {
  empresaId?: string;
  page?: number;
  limit?: number;
}

const notasService = {
  /**
   * Lista notas fiscais com filtros e paginação
   */
  async findAll(params?: FilterParams): Promise<PaginatedNotas> {
    const response = await api.get('/notas-fiscais', { params });
    return response.data.data;
  },

  /**
   * Busca rascunhos de notas fiscais
   */
  async findRascunhos(params?: FilterParams): Promise<PaginatedNotas> {
    const response = await api.get('/notas-fiscais', {
      params: { ...params, status: 'rascunho' },
    });
    return response.data.data;
  },

  /**
   * Busca nota fiscal por ID
   */
  async findOne(id: string): Promise<NotaFiscal> {
    const response = await api.get(`/notas-fiscais/${id}`);
    return response.data.data;
  },

  /**
   * Cria nova nota fiscal (rascunho)
   */
  async create(data: CreateNotaFiscalDto): Promise<NotaFiscal> {
    const response = await api.post('/notas-fiscais', data);
    return response.data.data;
  },

  /**
   * Atualiza nota fiscal (apenas rascunhos)
   */
  async update(id: string, data: UpdateNotaFiscalDto): Promise<NotaFiscal> {
    const response = await api.patch(`/notas-fiscais/${id}`, data);
    return response.data.data;
  },

  /**
   * Emite nota fiscal
   */
  async emitir(id: string): Promise<NotaFiscal> {
    const response = await api.post(`/notas-fiscais/${id}/emitir`);
    return response.data.data;
  },

  /**
   * Cancela nota fiscal
   */
  async cancelar(id: string, data: CancelarNotaFiscalDto): Promise<NotaFiscal> {
    const response = await api.post(`/notas-fiscais/${id}/cancelar`, data);
    return response.data.data;
  },

  /**
   * Remove nota fiscal (apenas rascunhos)
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/notas-fiscais/${id}`);
  },

  /**
   * Obtém estatísticas de notas fiscais
   */
  async getStats(params?: { empresaId?: string }): Promise<NotaFiscalStats> {
    const response = await api.get('/notas-fiscais/stats', { params });
    return response.data.data;
  },

  /**
   * Download do PDF da nota
   */
  async downloadPdf(id: string): Promise<Blob> {
    const response = await api.get(`/notas-fiscais/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Download do XML da nota
   */
  async downloadXml(id: string): Promise<Blob> {
    const response = await api.get(`/notas-fiscais/${id}/xml`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default notasService;
