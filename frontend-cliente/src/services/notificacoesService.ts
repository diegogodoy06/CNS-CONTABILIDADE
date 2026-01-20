import api from './api';
import type { Notification } from '../types';

export interface PaginatedNotificacoes {
  items: Notification[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface NotificacaoCountResponse {
  count: number;
}

export interface ConfiguracoesNotificacao {
  emailAtivo: boolean;
  pushAtivo: boolean;
  tiposAtivos: {
    critica: boolean;
    importante: boolean;
    informativa: boolean;
  };
  horarioInicio?: string;
  horarioFim?: string;
  diasSemana?: number[];
}

export interface UpdateConfiguracoesDto {
  emailAtivo?: boolean;
  pushAtivo?: boolean;
  tiposAtivos?: {
    critica?: boolean;
    importante?: boolean;
    informativa?: boolean;
  };
  horarioInicio?: string;
  horarioFim?: string;
  diasSemana?: number[];
}

export interface MarcarLidaDto {
  ids?: string[];
  marcarTodas?: boolean;
}

interface FilterParams {
  tipo?: 'critica' | 'importante' | 'informativa';
  lida?: boolean;
  page?: number;
  limit?: number;
}

const notificacoesService = {
  /**
   * Lista notificações com filtros e paginação
   */
  async findAll(params?: FilterParams): Promise<PaginatedNotificacoes> {
    const response = await api.get('/notificacoes', { params });
    return response.data.data;
  },

  /**
   * Busca notificação por ID
   */
  async findOne(id: string): Promise<Notification> {
    const response = await api.get(`/notificacoes/${id}`);
    return response.data.data;
  },

  /**
   * Conta notificações não lidas
   */
  async countNaoLidas(): Promise<number> {
    const response = await api.get('/notificacoes/count');
    return response.data.data.count;
  },

  /**
   * Marca notificações como lidas
   */
  async marcarComoLida(data: MarcarLidaDto): Promise<void> {
    await api.post('/notificacoes/marcar-lida', data);
  },

  /**
   * Marca uma notificação como lida
   */
  async marcarUmaComoLida(id: string): Promise<void> {
    await api.post('/notificacoes/marcar-lida', { ids: [id] });
  },

  /**
   * Marca todas as notificações como lidas
   */
  async marcarTodasComoLidas(): Promise<void> {
    await api.post('/notificacoes/marcar-lida', { marcarTodas: true });
  },

  /**
   * Remove notificação
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/notificacoes/${id}`);
  },

  /**
   * Obtém configurações de notificação
   */
  async getConfiguracoes(): Promise<ConfiguracoesNotificacao> {
    const response = await api.get('/notificacoes/configuracoes');
    return response.data.data;
  },

  /**
   * Atualiza configurações de notificação
   */
  async updateConfiguracoes(data: UpdateConfiguracoesDto): Promise<ConfiguracoesNotificacao> {
    const response = await api.post('/notificacoes/configuracoes', data);
    return response.data.data;
  },
};

export default notificacoesService;
