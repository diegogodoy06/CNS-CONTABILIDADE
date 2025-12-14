// ===================================
// CNS Contabilidade - Types
// ===================================

// --- User & Auth Types ---
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'administrador' | 'operador' | 'visualizador';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  regimeTributario: 'simples' | 'presumido' | 'real';
  cnaePrincipal: string;
  endereco: Address;
  telefone?: string;
  email: string;
  responsavelLegal: string;
  cpfResponsavel: string;
  certificadoDigital?: CertificadoDigital;
  configuracoesFiscais: ConfiguracoesFiscais;
  status: 'ativo' | 'inativo' | 'bloqueado';
  createdAt: string;
}

export interface Address {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  codigoMunicipio: string;
}

export interface CertificadoDigital {
  id: string;
  tipo: 'A1' | 'A3';
  validade: string;
  status: 'valido' | 'vencendo' | 'vencido';
}

export interface ConfiguracoesFiscais {
  aliquotaISSPadrao: number;
  municipioPrestacaoPadrao: string;
  serieNFe: string;
  proximoNumeroNota: number;
  codigoTributacaoMunicipal?: string;
  retencoesDefault: {
    ir: boolean;
    pis: boolean;
    cofins: boolean;
    csll: boolean;
    inss: boolean;
  };
}

// --- Document Types ---
export interface Document {
  id: string;
  nome: string;
  categoria: DocumentCategory;
  subcategoria?: string;
  dataUpload: string;
  dataReferencia?: string;
  competencia?: string;
  tamanho: number;
  formato: string;
  url: string;
  tags?: string[];
  uploadedBy: string;
  visualizado: boolean;
  compartilhadoContador: boolean;
  privado: boolean;
  versao: number;
  versaoAnterior?: string;
}

export type DocumentCategory = 
  | 'fiscal'
  | 'contabil'
  | 'trabalhista'
  | 'juridico'
  | 'operacional'
  | 'certificados'
  | 'modelos';

// --- Invoice (NF-e) Types ---
export interface NotaFiscal {
  id: string;
  numero?: number;
  serie: string;
  tipo: 'nfse' | 'nfe';
  status: NotaFiscalStatus;
  tomador: Tomador;
  servico: ServicoNF;
  valores: ValoresNF;
  tributos: TributosNF;
  dataEmissao?: string;
  dataCompetencia: string;
  localPrestacao: {
    municipio: string;
    uf: string;
    codigoMunicipio: string;
  };
  protocoloPrefeitura?: string;
  codigoVerificacao?: string;
  xmlUrl?: string;
  pdfUrl?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotaFiscalStatus = 
  | 'rascunho'
  | 'simulada'
  | 'processando'
  | 'emitida'
  | 'cancelada'
  | 'erro';

export interface ServicoNF {
  descricao: string;
  cnae: string;
  codigoTributacaoMunicipal: string;
  itemListaServico?: string;
}

export interface ValoresNF {
  valorServico: number;
  valorDeducoes?: number;
  valorDesconto?: number;
  baseCalculo: number;
  valorLiquido: number;
}

export interface TributosNF {
  iss: {
    aliquota: number;
    valor: number;
    retido: boolean;
    exigibilidade: 'normal' | 'suspensa' | 'isenta';
  };
  ir?: {
    aliquota: number;
    valor: number;
    retido: boolean;
  };
  pis?: {
    aliquota: number;
    valor: number;
    retido: boolean;
  };
  cofins?: {
    aliquota: number;
    valor: number;
    retido: boolean;
  };
  csll?: {
    aliquota: number;
    valor: number;
    retido: boolean;
  };
  inss?: {
    aliquota: number;
    valor: number;
    retido: boolean;
  };
}

// --- Taker (Tomador) Types ---
export interface Tomador {
  id: string;
  tipo: 'pj' | 'pf';
  documento: string; // CNPJ ou CPF
  razaoSocial?: string;
  nomeFantasia?: string;
  nome?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  endereco: Address;
  email: string;
  emailSecundario?: string;
  telefone?: string;
  cnaePrincipal?: string;
  regimeTributario?: 'simples' | 'presumido' | 'real';
  tags?: string[];
  ativo: boolean;
  totalNotas: number;
  faturamentoTotal: number;
  ultimaNotaEmitida?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Guide (Guia) Types ---
export interface Guia {
  id: string;
  tipo: TipoGuia;
  descricao: string;
  competencia: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: GuiaStatus;
  codigoBarras?: string;
  linhaDigitavel?: string;
  pdfUrl?: string;
  comprovanteUrl?: string;
  observacoes?: string;
  createdAt: string;
}

export type TipoGuia = 
  | 'DAS'
  | 'ISS'
  | 'INSS'
  | 'FGTS'
  | 'IRPJ'
  | 'CSLL'
  | 'PIS/COFINS'
  | 'obrigacao_acessoria';

export type GuiaStatus = 
  | 'pendente'
  | 'vencida'
  | 'paga'
  | 'parcelada'
  | 'cancelada';

// --- Notification Types ---
export interface Notification {
  id: string;
  tipo: 'critica' | 'importante' | 'informativa';
  titulo: string;
  mensagem: string;
  lida: boolean;
  dataEnvio: string;
  link?: string;
  acao?: {
    label: string;
    url: string;
  };
}

// --- Dashboard Types ---
export interface DashboardStats {
  notasEmitidas: {
    total: number;
    variacao: number;
  };
  faturamento: {
    total: number;
    variacao: number;
  };
  pendencias: {
    guias: number;
    documentos: number;
    total: number;
  };
  proximasObrigacoes: Guia[];
  notasRecentes: NotaFiscal[];
  documentosRecentes: Document[];
}

// --- API Response Types ---
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Form Types ---
export interface LoginForm {
  email: string;
  senha: string;
  lembrar: boolean;
}

export interface ResetPasswordForm {
  email: string;
  cpf: string;
}

export interface EmitirNotaForm {
  tomadorId: string;
  novoTomador?: Omit<Tomador, 'id' | 'createdAt' | 'updatedAt' | 'totalNotas' | 'faturamentoTotal' | 'ultimaNotaEmitida'>;
  servico: ServicoNF;
  valores: Omit<ValoresNF, 'baseCalculo' | 'valorLiquido'>;
  dataCompetencia: string;
  localPrestacao: {
    municipio: string;
    uf: string;
    codigoMunicipio: string;
  };
  observacoes?: string;
  retencoes: {
    ir: boolean;
    pis: boolean;
    cofins: boolean;
    csll: boolean;
    inss: boolean;
  };
}

// --- Filter Types ---
export interface DocumentFilters {
  categoria?: DocumentCategory;
  dataInicio?: string;
  dataFim?: string;
  competencia?: string;
  busca?: string;
  tags?: string[];
}

export interface NotaFiscalFilters {
  status?: NotaFiscalStatus;
  tomadorId?: string;
  dataInicio?: string;
  dataFim?: string;
  municipio?: string;
  busca?: string;
}

export interface GuiaFilters {
  tipo?: TipoGuia;
  status?: GuiaStatus;
  competencia?: string;
  dataVencimentoInicio?: string;
  dataVencimentoFim?: string;
}

export interface TomadorFilters {
  tipo?: 'pj' | 'pf';
  ativo?: boolean;
  busca?: string;
  tags?: string[];
}
