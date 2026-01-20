import api from './api';

// ===================================
// Tipos da API
// ===================================
interface ApiUser {
  id: string;
  email: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  celular?: string;
  tipo: 'ADMIN_SISTEMA' | 'ADMIN_ESCRITORIO' | 'COLABORADOR' | 'CLIENTE';
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'BLOQUEADO';
  emailVerificado: boolean;
  doisFatoresAtivo: boolean;
  ultimoLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface ApiLoginResponse {
  success: boolean;
  data: {
    user: ApiUser;
    tokens: ApiTokens;
  };
}

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  tipo: 'ADMIN_SISTEMA' | 'ADMIN_ESCRITORIO' | 'COLABORADOR';
  avatar?: string;
}

export interface LoginForm {
  email: string;
  senha: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ===================================
// Funções auxiliares
// ===================================
function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    nome: apiUser.nome,
    email: apiUser.email,
    cargo: mapTipoToCargo(apiUser.tipo),
    tipo: apiUser.tipo as User['tipo'],
  };
}

function mapTipoToCargo(tipo: ApiUser['tipo']): string {
  switch (tipo) {
    case 'ADMIN_SISTEMA':
      return 'Administrador do Sistema';
    case 'ADMIN_ESCRITORIO':
      return 'Administrador do Escritório';
    case 'COLABORADOR':
      return 'Colaborador';
    default:
      return 'Usuário';
  }
}

// ===================================
// Service de Autenticação Admin
// ===================================
export const authService = {
  /**
   * Login com Email e Senha
   */
  async login(data: LoginForm): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiLoginResponse>('/auth/login', {
        email: data.email.toLowerCase().trim(),
        senha: data.senha,
      });

      // API retorna { success, data: { user, tokens } }
      const apiData = response.data.data || response.data;
      const { user: apiUser, tokens } = apiData as { user: ApiUser; tokens: ApiTokens };

      // Validar se é um usuário admin
      if (!apiUser.tipo || !['ADMIN_SISTEMA', 'ADMIN_ESCRITORIO', 'COLABORADOR'].includes(apiUser.tipo)) {
        throw new Error('Acesso não autorizado. Use o portal do cliente.');
      }

      return {
        user: mapApiUserToUser(apiUser),
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error: any) {
      console.error('Erro no login admin:', error.response?.data || error);
      const message = error.response?.data?.message || error.message || 'Erro ao fazer login';
      throw new Error(message);
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    }
  },

  /**
   * Refresh Token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post<ApiTokens>('/auth/refresh', { refreshToken });
    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  },

  /**
   * Obter usuário autenticado atual
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ data?: ApiUser } | ApiUser>('/auth/me');
    // API pode retornar { data: user } ou diretamente user
    const responseData = response.data as any;
    const apiUser: ApiUser = responseData.data || responseData;
    return mapApiUserToUser(apiUser);
  },
};

export default authService;
