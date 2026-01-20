import api from './api';
import type { Guia, GuiaFilters, TipoGuia, GuiaStatus } from '../types';

export interface PaginatedGuias {
  items: Guia[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateGuiaDto {
  empresaId: string;
  tipo: TipoGuia;
  descricao: string;
  competencia: string;
  valor: number;
  dataVencimento: string;
  codigoBarras?: string;
  linhaDigitavel?: string;
  observacoes?: string;
}

export interface UpdateGuiaDto {
  descricao?: string;
  valor?: number;
  dataVencimento?: string;
  codigoBarras?: string;
  linhaDigitavel?: string;
  observacoes?: string;
}

export interface PagarGuiaDto {
  dataPagamento: string;
  valorPago?: number;
  comprovanteUrl?: string;
}

export interface GuiaResumo {
  pendentes: number;
  vencidas: number;
  pagas: number;
  totalPendente: number;
  totalPago: number;
}

interface FilterParams extends GuiaFilters {
  empresaId?: string;
  page?: number;
  limit?: number;
}

const guiasService = {
  /**
   * Lista guias com filtros e paginação
   */
  async findAll(params?: FilterParams): Promise<PaginatedGuias> {
    const response = await api.get('/guias', { params });
    return response.data.data;
  },

  /**
   * Busca guia por ID
   */
  async findOne(id: string): Promise<Guia> {
    const response = await api.get(`/guias/${id}`);
    return response.data.data;
  },

  /**
   * Cria nova guia
   */
  async create(data: CreateGuiaDto): Promise<Guia> {
    const response = await api.post('/guias', data);
    return response.data.data;
  },

  /**
   * Atualiza guia
   */
  async update(id: string, data: UpdateGuiaDto): Promise<Guia> {
    const response = await api.patch(`/guias/${id}`, data);
    return response.data.data;
  },

  /**
   * Registra pagamento da guia
   */
  async pagar(id: string, data: PagarGuiaDto): Promise<Guia> {
    const response = await api.post(`/guias/${id}/pagar`, data);
    return response.data.data;
  },

  /**
   * Cancela guia
   */
  async cancelar(id: string): Promise<Guia> {
    const response = await api.post(`/guias/${id}/cancelar`);
    return response.data.data;
  },

  /**
   * Remove guia
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/guias/${id}`);
  },

  /**
   * Lista guias próximas do vencimento
   */
  async getProximasVencer(dias: number = 7): Promise<Guia[]> {
    const response = await api.get('/guias/proximas-vencer', { params: { dias } });
    return response.data.data;
  },

  /**
   * Lista guias vencidas
   */
  async getVencidas(): Promise<Guia[]> {
    const response = await api.get('/guias/vencidas');
    return response.data.data;
  },

  /**
   * Obtém resumo das guias
   */
  async getResumo(params?: { empresaId?: string }): Promise<GuiaResumo> {
    const response = await api.get('/guias/resumo', { params });
    return response.data.data;
  },

  /**
   * Download do PDF da guia
   */
  async downloadPdf(id: string): Promise<Blob> {
    const response = await api.get(`/guias/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Upload de comprovante de pagamento
   */
  async uploadComprovante(id: string, file: File): Promise<Guia> {
    const formData = new FormData();
    formData.append('comprovante', file);
    
    const response = await api.post(`/guias/${id}/comprovante`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

export default guiasService;
