import type { User, Company, LoginForm } from '../types';

interface LoginResponse {
  user: User;
  company: Company;
  token: string;
  refreshToken: string;
}

// Mock data para desenvolvimento
const MOCK_USER: User = {
  id: '1',
  nome: 'João da Silva',
  email: 'joao@empresa.com.br',
  cpf: '123.456.789-00',
  telefone: '(11) 99999-9999',
  cargo: 'Administrador',
  perfil: 'admin',
  ativo: true,
  ultimoAcesso: new Date().toISOString(),
};

const MOCK_COMPANY: Company = {
  id: '1',
  cnpj: '12.345.678/0001-99',
  razaoSocial: 'Empresa Demo Ltda',
  nomeFantasia: 'Empresa Demo',
  inscricaoEstadual: '123.456.789.123',
  inscricaoMunicipal: '12345678',
  endereco: {
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Sala 101',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  },
  telefone: '(11) 3333-4444',
  email: 'contato@empresa.com.br',
  regime: 'simples',
  atividadePrincipal: '62.01-5-01 - Desenvolvimento de programas de computador sob encomenda',
};

// Credenciais válidas para teste
const VALID_CREDENTIALS = [
  { cnpj: '12345678000199', senha: '12345678' },
  { cnpj: '00000000000000', senha: 'admin123' },
];

export const authService = {
  // Login com CNPJ e senha (MODO MOCK)
  async login(data: LoginForm): Promise<LoginResponse> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Remove formatação do CNPJ
    const cleanCNPJ = data.cnpj.replace(/\D/g, '');
    
    // Verifica credenciais
    const isValid = VALID_CREDENTIALS.some(
      cred => cred.cnpj === cleanCNPJ && cred.senha === data.senha
    );
    
    if (!isValid) {
      throw new Error('CNPJ ou senha inválidos');
    }
    
    // Retorna dados mock
    return {
      user: MOCK_USER,
      company: { ...MOCK_COMPANY, cnpj: data.cnpj },
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignora erros no logout
      console.error('Erro ao fazer logout:', error);
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Recuperação de senha - Solicitar reset
  async requestPasswordReset(data: { email: string; cpf: string }): Promise<void> {
    try {
      await api.post('/auth/password/reset-request', data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Recuperação de senha - Validar token
  async validateResetToken(token: string): Promise<boolean> {
    try {
      const response = await api.get(`/auth/password/validate-token/${token}`);
      return response.data.data.valid;
    } catch (error) {
      return false;
    }
  },

  // Recuperação de senha - Definir nova senha
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/password/reset', { token, newPassword });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/password/change', { currentPassword, newPassword });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<{ user: User; company: Company }> {
    try {
      const response = await api.get<ApiResponse<{ user: User; company: Company }>>('/auth/me');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Verificar 2FA
  async verify2FA(code: string): Promise<{ token: string }> {
    try {
      const response = await api.post('/auth/2fa/verify', { code });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Ativar 2FA
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    try {
      const response = await api.post('/auth/2fa/enable');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Desativar 2FA
  async disable2FA(code: string): Promise<void> {
    try {
      await api.post('/auth/2fa/disable', { code });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default authService;
