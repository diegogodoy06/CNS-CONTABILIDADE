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
  name: 'João da Silva',
  email: 'joao@empresa.com.br',
  role: 'administrador',
  createdAt: '2024-01-01T00:00:00',
  lastLogin: new Date().toISOString(),
};

const MOCK_COMPANY: Company = {
  id: '1',
  cnpj: '12.345.678/0001-99',
  razaoSocial: 'Empresa Demo Ltda',
  nomeFantasia: 'Empresa Demo',
  inscricaoEstadual: '123.456.789.123',
  inscricaoMunicipal: '12345678',
  regimeTributario: 'simples',
  cnaePrincipal: '62.01-5-01',
  endereco: {
    cep: '01234-567',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Sala 101',
    bairro: 'Centro',
    cidade: 'São Paulo',
    uf: 'SP',
    codigoMunicipio: '3550308',
  },
  telefone: '(11) 3333-4444',
  email: 'contato@empresa.com.br',
  responsavelLegal: 'João da Silva',
  cpfResponsavel: '123.456.789-00',
  configuracoesFiscais: {
    aliquotaISSPadrao: 5,
    municipioPrestacaoPadrao: 'São Paulo',
    serieNFe: '1',
    proximoNumeroNota: 1024,
    codigoTributacaoMunicipal: '620150100',
    retencoesDefault: {
      ir: true,
      pis: true,
      cofins: true,
      csll: true,
      inss: false,
    },
  },
  status: 'ativo',
  createdAt: '2024-01-01T00:00:00',
};

// Credenciais válidas para teste
// Usuários podem ter acesso a múltiplas empresas
const VALID_CREDENTIALS = [
  { email: 'joao@empresa.com.br', senha: '12345678', requiresTwoFA: true },
  { email: 'admin@cnscontabil.com.br', senha: 'admin123', requiresTwoFA: false },
  { email: 'contador@cnscontabil.com.br', senha: 'contador123', requiresTwoFA: false },
];

// Empresas disponíveis para cada usuário
const USER_COMPANIES: Record<string, Company[]> = {
  'joao@empresa.com.br': [
    { ...MOCK_COMPANY, id: '1', cnpj: '12.345.678/0001-99', nomeFantasia: 'Empresa Demo', razaoSocial: 'Empresa Demo Ltda' },
    { ...MOCK_COMPANY, id: '2', cnpj: '98.765.432/0001-10', nomeFantasia: 'Outra Empresa', razaoSocial: 'Outra Empresa S/A' },
  ],
  'admin@cnscontabil.com.br': [
    { ...MOCK_COMPANY, id: '1', cnpj: '12.345.678/0001-99', nomeFantasia: 'Empresa Demo', razaoSocial: 'Empresa Demo Ltda' },
  ],
  'contador@cnscontabil.com.br': [
    { ...MOCK_COMPANY, id: '1', cnpj: '12.345.678/0001-99', nomeFantasia: 'Empresa Demo', razaoSocial: 'Empresa Demo Ltda' },
    { ...MOCK_COMPANY, id: '2', cnpj: '98.765.432/0001-10', nomeFantasia: 'Outra Empresa', razaoSocial: 'Outra Empresa S/A' },
    { ...MOCK_COMPANY, id: '3', cnpj: '11.222.333/0001-44', nomeFantasia: 'Terceira Empresa', razaoSocial: 'Terceira Empresa ME' },
  ],
};

export const authService = {
  // Login com Email e senha (MODO MOCK)
  async login(data: LoginForm): Promise<LoginResponse> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const email = data.email.toLowerCase().trim();
    
    // Verifica credenciais
    const credential = VALID_CREDENTIALS.find(
      cred => cred.email === email && cred.senha === data.senha
    );
    
    if (!credential) {
      throw new Error('Email ou senha inválidos');
    }
    
    // Retorna dados mock (primeira empresa do usuário)
    const companies = USER_COMPANIES[email] || [MOCK_COMPANY];
    return {
      user: { ...MOCK_USER, email: email },
      company: companies[0],
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  },

  // Obter empresas do usuário (MOCK)
  async getUserCompanies(email: string): Promise<Company[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return USER_COMPANIES[email.toLowerCase()] || [];
  },

  // Verificar se precisa de 2FA (MOCK)
  async checkRequires2FA(email: string): Promise<boolean> {
    const credential = VALID_CREDENTIALS.find(c => c.email === email.toLowerCase());
    return credential?.requiresTwoFA || false;
  },

  // Logout (MOCK)
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Logout realizado');
  },

  // Refresh token (MOCK)
  async refreshToken(_refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  },

  // Recuperação de senha - Solicitar reset (MOCK)
  async requestPasswordReset(data: { email: string; cpf: string }): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Reset de senha solicitado para:', data.email);
  },

  // Recuperação de senha - Validar token (MOCK)
  async validateResetToken(_token: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  // Recuperação de senha - Definir nova senha (MOCK)
  async resetPassword(_token: string, _newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Senha redefinida com sucesso');
  },

  // Alterar senha (MOCK)
  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Senha alterada com sucesso');
  },

  // Obter usuário atual (MOCK)
  async getCurrentUser(): Promise<{ user: User; company: Company }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { user: MOCK_USER, company: MOCK_COMPANY };
  },

  // Verificar 2FA (MOCK)
  async verify2FA(code: string): Promise<{ token: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (code === '123456') {
      return { token: 'mock-2fa-token-' + Date.now() };
    }
    throw new Error('Código 2FA inválido');
  },

  // Ativar 2FA (MOCK)
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      secret: 'JBSWY3DPEHPK3PXP',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    };
  },

  // Desativar 2FA (MOCK)
  async disable2FA(code: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (code !== '123456') {
      throw new Error('Código 2FA inválido');
    }
    console.log('2FA desativado');
  },
};

export default authService;
