import api from './api';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  perfil: 'admin' | 'operador' | 'visualizador';
  ativo: boolean;
  ultimoAcesso: string | null;
  convitePendente: boolean;
  criadoEm: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  cpf?: string;
  perfil: 'admin' | 'operador' | 'visualizador';
}

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  cpf?: string;
  perfil?: 'admin' | 'operador' | 'visualizador';
  ativo?: boolean;
}

export interface UsuarioFilters {
  page?: number;
  limit?: number;
  search?: string;
  perfil?: string;
  ativo?: boolean;
}

export interface PaginatedUsuarios {
  items: Usuario[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const usuariosService = {
  /**
   * Lista usuários da empresa com paginação e filtros
   */
  async findAll(filters?: UsuarioFilters): Promise<PaginatedUsuarios> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.perfil) params.append('perfil', filters.perfil);
    if (filters?.ativo !== undefined) params.append('ativo', filters.ativo.toString());

    const response = await api.get(`/cliente/usuarios?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Busca um usuário por ID
   */
  async findOne(id: string): Promise<Usuario> {
    const response = await api.get(`/cliente/usuarios/${id}`);
    return response.data.data;
  },

  /**
   * Cria um novo usuário (envia convite)
   */
  async create(data: CreateUsuarioDto): Promise<Usuario> {
    const response = await api.post('/cliente/usuarios', data);
    return response.data.data;
  },

  /**
   * Atualiza um usuário
   */
  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    const response = await api.patch(`/cliente/usuarios/${id}`, data);
    return response.data.data;
  },

  /**
   * Remove um usuário (soft delete)
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/cliente/usuarios/${id}`);
  },

  /**
   * Restaura um usuário excluído
   */
  async restore(id: string): Promise<Usuario> {
    const response = await api.post(`/cliente/usuarios/${id}/restaurar`);
    return response.data.data;
  },

  /**
   * Reenvia convite para um usuário
   */
  async reenviarConvite(id: string): Promise<void> {
    await api.post(`/cliente/usuarios/${id}/reenviar-convite`);
  },

  /**
   * Alterna o status ativo/inativo do usuário
   */
  async toggleAtivo(id: string, ativo: boolean): Promise<Usuario> {
    const response = await api.patch(`/cliente/usuarios/${id}`, { ativo });
    return response.data.data;
  },
};

export default usuariosService;
