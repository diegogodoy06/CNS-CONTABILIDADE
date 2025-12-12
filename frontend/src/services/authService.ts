import api, { handleApiError } from './api';
import type { User, Company, LoginForm, ApiResponse } from '../types';

interface LoginResponse {
  user: User;
  company: Company;
  token: string;
  refreshToken: string;
}

export const authService = {
  // Login com CNPJ e senha
  async login(data: LoginForm): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
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
