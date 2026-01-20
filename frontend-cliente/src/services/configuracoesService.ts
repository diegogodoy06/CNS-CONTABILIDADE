import api from './api';
import type { Company, User } from '../types';

export interface PerfilUsuario extends User {
  telefone?: string;
  cpf?: string;
  empresas: Company[];
  empresaAtiva?: Company;
  configuracoes: {
    notificacoesEmail: boolean;
    notificacoesPush: boolean;
    temaEscuro: boolean;
    idioma: string;
  };
}

export interface UpdatePerfilDto {
  name?: string;
  email?: string;
  telefone?: string;
  avatar?: File;
}

export interface AlterarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export interface ConfiguracoesUsuario {
  notificacoesEmail: boolean;
  notificacoesPush: boolean;
  temaEscuro: boolean;
  idioma: string;
}

const configuracoesService = {
  /**
   * Obtém perfil do usuário
   */
  async getPerfil(): Promise<PerfilUsuario> {
    const response = await api.get('/cliente/configuracoes/perfil');
    return response.data.data;
  },

  /**
   * Atualiza perfil do usuário
   */
  async updatePerfil(data: UpdatePerfilDto): Promise<PerfilUsuario> {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.telefone) formData.append('telefone', data.telefone);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await api.patch('/cliente/configuracoes/perfil', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Altera senha do usuário
   */
  async alterarSenha(data: AlterarSenhaDto): Promise<void> {
    await api.post('/cliente/configuracoes/alterar-senha', data);
  },

  /**
   * Obtém configurações do usuário
   */
  async getConfiguracoes(): Promise<ConfiguracoesUsuario> {
    const response = await api.get('/cliente/configuracoes/preferencias');
    return response.data.data;
  },

  /**
   * Atualiza configurações do usuário
   */
  async updateConfiguracoes(data: Partial<ConfiguracoesUsuario>): Promise<ConfiguracoesUsuario> {
    const response = await api.patch('/cliente/configuracoes/preferencias', data);
    return response.data.data;
  },

  /**
   * Lista empresas do usuário
   */
  async getEmpresas(): Promise<Company[]> {
    const response = await api.get('/cliente/configuracoes/empresas');
    return response.data.data;
  },

  /**
   * Seleciona empresa ativa
   */
  async selecionarEmpresa(empresaId: string): Promise<Company> {
    const response = await api.post(`/cliente/configuracoes/empresas/${empresaId}/selecionar`);
    return response.data.data;
  },

  /**
   * Obtém detalhes da empresa
   */
  async getEmpresa(empresaId: string): Promise<Company> {
    const response = await api.get(`/cliente/configuracoes/empresas/${empresaId}`);
    return response.data.data;
  },
};

export default configuracoesService;
