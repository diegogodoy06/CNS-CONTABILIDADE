// Types do Portal Administrativo

export interface Cliente {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: string;
  responsavel: string;
  status: 'ativo' | 'inadimplente' | 'bloqueado' | 'inativo';
  regime: 'simples' | 'lucro_presumido' | 'lucro_real';
  dataContrato: string;
  ultimaAtividade: string;
  notasEmitidas: number;
  faturamentoMensal: number;
  guiasPendentes: number;
  ticketsAbertos: number;
  alertas: number;
  endereco: Endereco;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
  perfil: 'admin' | 'contador' | 'auxiliar';
}

export interface Alerta {
  id: string;
  tipo: 'critico' | 'importante' | 'informativo';
  titulo: string;
  descricao: string;
  clienteId: string;
  clienteNome: string;
  dataHora: string;
  lido: boolean;
  categoria: 'guia' | 'nota' | 'ticket' | 'sistema' | 'financeiro';
}

export interface NotaFiscal {
  id: string;
  numero: string;
  serie: string;
  clienteId: string;
  clienteNome: string;
  tomadorNome: string;
  tomadorDocumento: string;
  valor: number;
  dataEmissao: string;
  status: 'emitida' | 'cancelada' | 'pendente';
}

export interface Guia {
  id: string;
  clienteId: string;
  clienteNome: string;
  tipo: 'ISS' | 'IRPJ' | 'CSLL' | 'PIS' | 'COFINS' | 'INSS' | 'FGTS' | 'DAS';
  competencia: string;
  vencimento: string;
  valor: number;
  status: 'paga' | 'pendente' | 'vencida';
}

export interface Ticket {
  id: string;
  clienteId: string;
  clienteNome: string;
  assunto: string;
  categoria: 'duvida' | 'problema' | 'solicitacao';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido';
  dataCriacao: string;
  dataAtualizacao: string;
  responsavel?: string;
}

export interface Comunicado {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'informativo' | 'urgente' | 'aviso';
  destinatarios: 'todos' | 'ativos' | 'inadimplentes' | 'especificos';
  clientesIds?: string[];
  dataEnvio: string;
  status: 'rascunho' | 'agendado' | 'enviado';
  leituras: number;
}
