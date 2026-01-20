import api from './api';

export interface Ticket {
  id: string;
  empresaId: string;
  assunto: string;
  descricao: string;
  categoria: 'duvida' | 'problema' | 'solicitacao' | 'sugestao';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'aguardando_resposta' | 'resolvido' | 'fechado';
  mensagens: TicketMensagem[];
  criadoEm: string;
  atualizadoEm: string;
  criadoPor: {
    id: string;
    nome: string;
  };
  atribuidoPara?: {
    id: string;
    nome: string;
  };
}

export interface TicketMensagem {
  id: string;
  ticketId: string;
  conteudo: string;
  anexos?: string[];
  criadoEm: string;
  autor: {
    id: string;
    nome: string;
    tipo: 'cliente' | 'contador';
  };
}

export interface PaginatedTickets {
  items: Ticket[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateTicketDto {
  assunto: string;
  descricao: string;
  categoria: 'duvida' | 'problema' | 'solicitacao' | 'sugestao';
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
}

export interface CreateMensagemDto {
  conteudo: string;
  anexos?: File[];
}

interface FilterParams {
  status?: string;
  categoria?: string;
  prioridade?: string;
  page?: number;
  limit?: number;
}

const ticketsService = {
  /**
   * Lista tickets do cliente
   */
  async findAll(params?: FilterParams): Promise<PaginatedTickets> {
    const response = await api.get('/cliente/tickets', { params });
    return response.data.data;
  },

  /**
   * Busca ticket por ID
   */
  async findOne(id: string): Promise<Ticket> {
    const response = await api.get(`/cliente/tickets/${id}`);
    return response.data.data;
  },

  /**
   * Cria novo ticket
   */
  async create(empresaId: string, data: CreateTicketDto): Promise<Ticket> {
    const response = await api.post(`/cliente/tickets/${empresaId}`, data);
    return response.data.data;
  },

  /**
   * Adiciona mensagem ao ticket
   */
  async addMensagem(ticketId: string, data: CreateMensagemDto): Promise<TicketMensagem> {
    const formData = new FormData();
    formData.append('conteudo', data.conteudo);
    
    if (data.anexos) {
      data.anexos.forEach((file, index) => {
        formData.append(`anexos`, file);
      });
    }

    const response = await api.post(`/cliente/tickets/${ticketId}/mensagem`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Fecha ticket
   */
  async fechar(id: string): Promise<Ticket> {
    const response = await api.post(`/cliente/tickets/${id}/fechar`);
    return response.data.data;
  },

  /**
   * Reabre ticket
   */
  async reabrir(id: string): Promise<Ticket> {
    const response = await api.post(`/cliente/tickets/${id}/reabrir`);
    return response.data.data;
  },
};

export default ticketsService;
