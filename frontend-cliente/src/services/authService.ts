import api from './api';
import type { User, Company, LoginForm } from '../types';

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

interface LoginResponse {
  user: User;
  company: Company | null;
  token: string;
  refreshToken: string;
}

// ===================================
// Funções auxiliares
// ===================================

// Converte usuário da API para tipo do frontend
function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.nome,
    role: mapTipoToRole(apiUser.tipo),
    createdAt: apiUser.createdAt,
    lastLogin: apiUser.ultimoLogin,
  };
}

function mapTipoToRole(tipo: ApiUser['tipo']): User['role'] {
  switch (tipo) {
    case 'ADMIN_SISTEMA':
    case 'ADMIN_ESCRITORIO':
      return 'administrador';
    case 'COLABORADOR':
      return 'operador';
    case 'CLIENTE':
    default:
      return 'visualizador';
  }
}

// ===================================
// Função auxiliar para mapear empresa da API
// ===================================
function mapApiEmpresaToCompany(apiEmpresa: any): Company {
  return {
    id: apiEmpresa.id,
    cnpj: apiEmpresa.cnpj,
    razaoSocial: apiEmpresa.razaoSocial,
    nomeFantasia: apiEmpresa.nomeFantasia,
    inscricaoMunicipal: apiEmpresa.inscricaoMunicipal,
    inscricaoEstadual: apiEmpresa.inscricaoEstadual,
    regimeTributario: apiEmpresa.regimeTributario?.toLowerCase() || 'simples',
    cnaePrincipal: apiEmpresa.cnaePrincipal || '',
    endereco: {
      cep: apiEmpresa.cep || '',
      logradouro: apiEmpresa.logradouro || '',
      numero: apiEmpresa.numero || '',
      complemento: apiEmpresa.complemento,
      bairro: apiEmpresa.bairro || '',
      cidade: apiEmpresa.cidade || '',
      uf: apiEmpresa.uf || '',
      codigoMunicipio: apiEmpresa.codigoMunicipio || '',
    },
    telefone: apiEmpresa.telefone,
    email: apiEmpresa.email || '',
    responsavelLegal: apiEmpresa.responsavelNome || '',
    cpfResponsavel: apiEmpresa.responsavelCpf || '',
    configuracoesFiscais: {
      aliquotaISSPadrao: apiEmpresa.aliquotaIss || 5,
      municipioPrestacaoPadrao: apiEmpresa.cidade || '',
      serieNFe: '1',
      proximoNumeroNota: 1,
      retencoesDefault: {
        ir: false,
        pis: false,
        cofins: false,
        csll: false,
        inss: false,
      },
    },
    status: apiEmpresa.status?.toLowerCase() || 'ativo',
    createdAt: apiEmpresa.createdAt,
  };
}

export const authService = {
  // Login com Email e senha
  async login(data: LoginForm): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiLoginResponse>('/auth/login', {
        email: data.email.toLowerCase().trim(),
        senha: data.senha,
      });

      // API retorna { success, data: { user, tokens } }
      const apiData = response.data.data || response.data;
      const { user: apiUser, tokens } = apiData as { user: ApiUser; tokens: ApiTokens };

      // Buscar empresas do usuário após login
      let company: Company | null = null;
      try {
        const empresasResponse = await api.get<{ data: any[] } | any[]>('/empresas', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` }
        });
        // API pode retornar { data: [...] } ou diretamente [...]
        const empresasData = empresasResponse.data;
        const empresas = Array.isArray(empresasData) 
          ? empresasData 
          : (empresasData.data || []);
        if (empresas && empresas.length > 0) {
          company = mapApiEmpresaToCompany(empresas[0]);
        }
      } catch (err) {
        console.warn('Não foi possível carregar empresas do usuário:', err);
      }

      return {
        user: mapApiUserToUser(apiUser),
        company,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error: any) {
      console.error('Erro no login:', error.response?.data || error);
      const message = error.response?.data?.message || 'Erro ao fazer login';
      throw new Error(message);
    }
  },

  // Obter empresas do usuário
  async getUserCompanies(): Promise<Company[]> {
    try {
      const response = await api.get<{ data: any[] }>('/empresas');
      const empresas = response.data.data || response.data;
      return empresas.map(mapApiEmpresaToCompany);
    } catch (error) {
      console.warn('Erro ao buscar empresas:', error);
      return [];
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post<ApiTokens>('/auth/refresh', { refreshToken });
    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  },

  // Recuperação de senha - Solicitar reset
  async requestPasswordReset(data: { email: string; cpf?: string }): Promise<void> {
    await api.post('/auth/forgot-password', {
      email: data.email.toLowerCase().trim(),
    });
  },

  // Recuperação de senha - Validar token
  async validateResetToken(token: string): Promise<boolean> {
    try {
      await api.get(`/auth/reset-password/${token}`);
      return true;
    } catch {
      return false;
    }
  },

  // Recuperação de senha - Definir nova senha
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post(`/auth/reset-password/${token}`, {
      novaSenha: newPassword,
    });
  },

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      senhaAtual: currentPassword,
      novaSenha: newPassword,
    });
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<{ user: User; company: Company | null }> {
    const response = await api.get<{ data?: ApiUser } | ApiUser>('/auth/me');
    
    // API pode retornar { data: user } ou diretamente user
    const responseData = response.data as any;
    const apiUser: ApiUser = responseData.data || responseData;
    
    // Buscar empresa selecionada
    let company: Company | null = null;
    try {
      const empresasResponse = await api.get<{ data: any[] } | any[]>('/empresas');
      const empresasData = empresasResponse.data as any;
      const empresas = Array.isArray(empresasData) 
        ? empresasData 
        : (empresasData.data || []);
      if (empresas && empresas.length > 0) {
        company = mapApiEmpresaToCompany(empresas[0]);
      }
    } catch {
      console.warn('Não foi possível carregar empresas do usuário');
    }

    return {
      user: mapApiUserToUser(apiUser),
      company,
    };
  },

  // Verificar 2FA
  async verify2FA(code: string, email?: string): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post<ApiTokens>('/auth/2fa/verify', {
      codigo: code,
      email,
    });

    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  },

  // Ativar 2FA
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    const response = await api.post<{ secret: string; qrCodeUrl: string }>('/auth/2fa/setup');
    return {
      secret: response.data.secret,
      qrCode: response.data.qrCodeUrl,
    };
  },

  // Desativar 2FA
  async disable2FA(code: string): Promise<void> {
    await api.post('/auth/2fa/disable', { codigo: code });
  },

  // Listar dispositivos conectados
  async getDispositivos(): Promise<Dispositivo[]> {
    const response = await api.get('/auth/dispositivos');
    return response.data.data || response.data;
  },

  // Revogar sessão de um dispositivo
  async revogarDispositivo(id: string): Promise<void> {
    await api.delete(`/auth/dispositivos/${id}`);
  },

  // Revogar todas as sessões exceto a atual
  async revogarTodosDispositivos(): Promise<void> {
    await api.delete('/auth/dispositivos');
  },
};

// Interface de Dispositivo
export interface Dispositivo {
  id: string;
  tipo: 'desktop' | 'mobile' | 'tablet';
  nome: string;
  navegador: string;
  sistemaOperacional: string;
  ip: string;
  localizacao: string;
  ultimoAcesso: string;
  sessaoAtual: boolean;
}

export default authService;
