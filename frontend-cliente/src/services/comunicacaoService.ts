import api from './api';

export interface Mensagem {
  id: string;
  assunto: string;
  conteudo: string;
  remetente: {
    id: string;
    nome: string;
    tipo: 'cliente' | 'contador';
  };
  destinatario: {
    id: string;
    nome: string;
    tipo: 'cliente' | 'contador';
  };
  lida: boolean;
  dataEnvio: string;
  dataLeitura?: string;
  anexos?: string[];
  respondidaEm?: string;
  respostaId?: string;
}

export interface PaginatedMensagens {
  items: Mensagem[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateMensagemDto {
  assunto: string;
  conteudo: string;
  destinatarioId: string;
  anexos?: File[];
  respostaDeId?: string;
}

export interface NotificacaoComunicacao {
  id: string;
  tipo: 'nova_mensagem' | 'resposta' | 'leitura';
  mensagemId: string;
  lida: boolean;
  criadoEm: string;
}

interface FilterParams {
  lida?: boolean;
  page?: number;
  limit?: number;
}

const comunicacaoService = {
  /**
   * Lista mensagens enviadas
   */
  async getEnviadas(params?: FilterParams): Promise<PaginatedMensagens> {
    const response = await api.get('/cliente/comunicacao/mensagens/enviadas', { params });
    return response.data.data;
  },

  /**
   * Lista mensagens recebidas
   */
  async getRecebidas(params?: FilterParams): Promise<PaginatedMensagens> {
    const response = await api.get('/cliente/comunicacao/mensagens/recebidas', { params });
    return response.data.data;
  },

  /**
   * Busca mensagem por ID
   */
  async findOne(id: string): Promise<Mensagem> {
    const response = await api.get(`/cliente/comunicacao/mensagens/${id}`);
    return response.data.data;
  },

  /**
   * Envia nova mensagem
   */
  async enviar(data: CreateMensagemDto): Promise<Mensagem> {
    const formData = new FormData();
    formData.append('assunto', data.assunto);
    formData.append('conteudo', data.conteudo);
    formData.append('destinatarioId', data.destinatarioId);
    
    if (data.respostaDeId) {
      formData.append('respostaDeId', data.respostaDeId);
    }
    
    if (data.anexos) {
      data.anexos.forEach((file) => {
        formData.append('anexos', file);
      });
    }

    const response = await api.post('/cliente/comunicacao/mensagens', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Marca mensagem como lida
   */
  async marcarComoLida(id: string): Promise<void> {
    await api.post(`/cliente/comunicacao/mensagens/${id}/lida`);
  },

  /**
   * Lista notificações de comunicação
   */
  async getNotificacoes(params?: FilterParams): Promise<NotificacaoComunicacao[]> {
    const response = await api.get('/cliente/comunicacao/notificacoes', { params });
    return response.data.data;
  },

  /**
   * Conta mensagens não lidas
   */
  async countNaoLidas(): Promise<number> {
    const response = await api.get('/cliente/comunicacao/mensagens/count');
    return response.data.data.count;
  },
};

export default comunicacaoService;
