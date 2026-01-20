import api from './api';
import type { Tomador, TomadorFilters, Address } from '../types';

export interface PaginatedTomadores {
  items: Tomador[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// DTO do frontend (formato usado na UI)
export interface CreateTomadorDto {
  empresaId: string;
  tipo: 'pj' | 'pf';
  documento: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  nome?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  endereco?: Address;
  email?: string;
  emailSecundario?: string;
  telefone?: string;
  cnaePrincipal?: string;
  regimeTributario?: 'simples' | 'presumido' | 'real';
  tags?: string[];
}

// DTO esperado pelo backend
interface BackendCreateTomadorDto {
  empresaId: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
  cpfCnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  email?: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  estadoId?: number;
  municipioCodigo?: number;
  tags?: string[];
  observacoes?: string;
}

export interface UpdateTomadorDto {
  razaoSocial?: string;
  nomeFantasia?: string;
  nome?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  endereco?: Address;
  email?: string;
  emailSecundario?: string;
  telefone?: string;
  cnaePrincipal?: string;
  regimeTributario?: 'simples' | 'presumido' | 'real';
  tags?: string[];
  ativo?: boolean;
}

interface FilterParams extends TomadorFilters {
  empresaId?: string;
  page?: number;
  limit?: number;
  documento?: string;
}

// Mapear parâmetros de filtro do frontend para o formato do backend
const mapFilterParams = (params?: FilterParams) => {
  if (!params) return {};
  
  const mapped: Record<string, any> = {};
  
  // Copiar campos que são iguais
  if (params.empresaId) mapped.empresaId = params.empresaId;
  if (params.page) mapped.page = params.page;
  // Backend usa perPage, não limit
  if (params.limit) mapped.perPage = params.limit;
  if (params.busca) mapped.busca = params.busca;
  if (params.ativo !== undefined) mapped.ativo = params.ativo;
  
  // Mapear tipo para tipoPessoa com uppercase (formato do backend)
  if (params.tipo) {
    mapped.tipoPessoa = params.tipo === 'pf' ? 'FISICA' : 'JURIDICA';
  }
  
  // Mapear documento para cpfCnpj
  if (params.documento) {
    mapped.cpfCnpj = params.documento.replace(/\D/g, '');
  }
  
  return mapped;
};

// Mapear dados de criação do frontend para o formato do backend
const mapCreateDto = (data: CreateTomadorDto): BackendCreateTomadorDto => {
  const mapped: BackendCreateTomadorDto = {
    empresaId: data.empresaId,
    tipoPessoa: data.tipo === 'pf' ? 'FISICA' : 'JURIDICA',
    cpfCnpj: data.documento.replace(/\D/g, ''),
    razaoSocial: data.razaoSocial || data.nome || '',
    nomeFantasia: data.nomeFantasia,
    inscricaoMunicipal: data.inscricaoMunicipal,
    inscricaoEstadual: data.inscricaoEstadual,
  };

  // Email (apenas se válido)
  if (data.email && data.email.includes('@')) {
    mapped.email = data.email;
  }

  // Telefone (apenas números)
  if (data.telefone) {
    mapped.telefone = data.telefone.replace(/\D/g, '');
  }

  // Tags
  if (data.tags && data.tags.length > 0) {
    mapped.tags = data.tags;
  }

  // Endereço (campos separados)
  if (data.endereco) {
    if (data.endereco.logradouro) mapped.logradouro = data.endereco.logradouro;
    if (data.endereco.numero) mapped.numero = data.endereco.numero;
    if (data.endereco.complemento) mapped.complemento = data.endereco.complemento;
    if (data.endereco.bairro) mapped.bairro = data.endereco.bairro;
    if (data.endereco.cep) mapped.cep = data.endereco.cep.replace(/\D/g, '');
    if (data.endereco.codigoMunicipio) {
      const codigoMun = parseInt(data.endereco.codigoMunicipio, 10);
      mapped.municipioCodigo = codigoMun;
      // Extrair estadoId dos 2 primeiros dígitos do código IBGE do município
      // Ex: 3550308 (São Paulo) -> estadoId = 35
      mapped.estadoId = Math.floor(codigoMun / 100000);
    }
  }

  return mapped;
};

// Mapear dados de atualização do frontend para o formato do backend
const mapUpdateDto = (data: UpdateTomadorDto): Record<string, any> => {
  const mapped: Record<string, any> = {};

  // Para PF, o nome vai como razaoSocial no backend
  if (data.razaoSocial || data.nome) {
    mapped.razaoSocial = data.razaoSocial || data.nome;
  }
  if (data.nomeFantasia) mapped.nomeFantasia = data.nomeFantasia;
  if (data.inscricaoMunicipal) mapped.inscricaoMunicipal = data.inscricaoMunicipal;
  if (data.inscricaoEstadual) mapped.inscricaoEstadual = data.inscricaoEstadual;
  if (data.ativo !== undefined) mapped.ativo = data.ativo;

  // Email (apenas se válido)
  if (data.email && data.email.includes('@')) {
    mapped.email = data.email;
  }

  // Telefone (apenas números)
  if (data.telefone) {
    mapped.telefone = data.telefone.replace(/\D/g, '');
  }

  // Tags
  if (data.tags && data.tags.length > 0) {
    mapped.tags = data.tags;
  }

  // Endereço (campos separados)
  if (data.endereco) {
    if (data.endereco.logradouro) mapped.logradouro = data.endereco.logradouro;
    if (data.endereco.numero) mapped.numero = data.endereco.numero;
    if (data.endereco.complemento) mapped.complemento = data.endereco.complemento;
    if (data.endereco.bairro) mapped.bairro = data.endereco.bairro;
    if (data.endereco.cep) mapped.cep = data.endereco.cep.replace(/\D/g, '');
    if (data.endereco.codigoMunicipio) {
      const codigoMun = parseInt(data.endereco.codigoMunicipio, 10);
      mapped.municipioCodigo = codigoMun;
      // Extrair estadoId dos 2 primeiros dígitos do código IBGE do município
      mapped.estadoId = Math.floor(codigoMun / 100000);
    }
  }

  return mapped;
};

// Mapear resposta do backend para o formato do frontend
const mapTomadorResponse = (data: any): Tomador => {
  return {
    id: data.id,
    tipo: data.tipoPessoa === 'FISICA' ? 'pf' : 'pj',
    documento: data.cpfCnpj,
    razaoSocial: data.razaoSocial,
    nomeFantasia: data.nomeFantasia,
    nome: data.razaoSocial,
    inscricaoMunicipal: data.inscricaoMunicipal,
    inscricaoEstadual: data.inscricaoEstadual,
    email: data.email || '',
    telefone: data.telefone,
    endereco: {
      cep: data.cep || '',
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.municipio?.nome || '',
      uf: data.estado?.sigla || '',
      codigoMunicipio: data.municipioCodigo?.toString() || '',
    },
    tags: data.tags || [],
    ativo: data.ativo ?? true,
    totalNotas: data.totalNotas || 0,
    faturamentoTotal: data.faturamentoTotal || 0,
    ultimaNotaEmitida: data.ultimaNotaEmitida,
    createdAt: data.criadoEm || new Date().toISOString(),
    updatedAt: data.atualizadoEm || new Date().toISOString(),
  };
};

const tomadoresService = {
  /**
   * Lista tomadores com filtros e paginação
   */
  async findAll(params?: FilterParams): Promise<PaginatedTomadores> {
    const response = await api.get('/tomadores', { params: mapFilterParams(params) });
    const payload = response.data?.data;
    // API can return either { data: [...], meta } or { data: { items: [...], meta } }
    const itemsSource = Array.isArray(payload)
      ? payload
      : Array.isArray(response.data)
        ? response.data
        : payload?.items || [];

    const meta = response.data?.meta || payload?.meta || {
      total: itemsSource.length,
      page: params?.page || 1,
      perPage: params?.limit || 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
    
    return {
      items: itemsSource.map(mapTomadorResponse),
      meta,
    };
  },

  /**
   * Busca tomador por ID
   */
  async findOne(id: string): Promise<Tomador> {
    const response = await api.get(`/tomadores/${id}`);
    return mapTomadorResponse(response.data.data);
  },

  /**
   * Cria novo tomador
   */
  async create(data: CreateTomadorDto): Promise<Tomador> {
    const response = await api.post('/tomadores', mapCreateDto(data));
    return mapTomadorResponse(response.data.data);
  },

  /**
   * Atualiza tomador
   */
  async update(id: string, data: UpdateTomadorDto): Promise<Tomador> {
    const response = await api.patch(`/tomadores/${id}`, mapUpdateDto(data));
    return mapTomadorResponse(response.data.data);
  },

  /**
   * Remove tomador
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/tomadores/${id}`);
  },

  /**
   * Busca tomador por CPF/CNPJ
   */
  async findByDocumento(documento: string, empresaId: string): Promise<Tomador | null> {
    try {
      const response = await api.get('/tomadores', {
        params: { 
          cpfCnpj: documento.replace(/\D/g, ''), 
          empresaId 
        },
      });
      const payload = response.data?.data;
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(response.data)
          ? response.data
          : payload?.items || [];
      if (items.length > 0) {
        return mapTomadorResponse(items[0]);
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Lista tomadores recentes (últimos utilizados)
   */
  async getRecentes(empresaId: string, limit: number = 5): Promise<Tomador[]> {
    const response = await api.get('/tomadores', {
      params: { 
        empresaId, 
        perPage: limit, 
      },
    });
    const payload = response.data?.data;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(response.data)
        ? response.data
        : payload?.items || [];
    return items.map(mapTomadorResponse);
  },
};

export default tomadoresService;
