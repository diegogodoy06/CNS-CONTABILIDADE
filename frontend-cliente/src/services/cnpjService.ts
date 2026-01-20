/**
 * Serviço de Consulta de CNPJ
 * Utiliza a BrasilAPI (https://brasilapi.com.br) que agrega dados oficiais da Receita Federal
 * API gratuita e sem necessidade de autenticação
 */

export interface DadosCNPJ {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: 'ATIVA' | 'BAIXADA' | 'INAPTA' | 'SUSPENSA' | 'NULA';
  dataAbertura: string;
  naturezaJuridica: string;
  cnaePrincipal: {
    codigo: string;
    descricao: string;
  };
  cnaesSecundarios: Array<{
    codigo: string;
    descricao: string;
  }>;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  telefone?: string;
  email?: string;
  capitalSocial?: number;
  porte?: string;
  optanteSimplesNacional?: boolean;
  optanteMei?: boolean;
}

interface BrasilAPIResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  descricao_situacao_cadastral: string;
  data_inicio_atividade: string;
  natureza_juridica: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  cnaes_secundarios: Array<{
    codigo: number;
    descricao: string;
  }>;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  email: string;
  capital_social: number;
  porte: string;
  opcao_pelo_simples: boolean | null;
  opcao_pelo_mei: boolean | null;
  descricao_porte: string;
}

/**
 * Mapeia a descrição da situação cadastral para o tipo padronizado
 */
const mapSituacao = (descricao: string): DadosCNPJ['situacao'] => {
  const situacaoUpper = descricao?.toUpperCase() || '';
  if (situacaoUpper.includes('ATIVA')) return 'ATIVA';
  if (situacaoUpper.includes('BAIXADA')) return 'BAIXADA';
  if (situacaoUpper.includes('INAPTA')) return 'INAPTA';
  if (situacaoUpper.includes('SUSPENSA')) return 'SUSPENSA';
  if (situacaoUpper.includes('NULA')) return 'NULA';
  return 'ATIVA'; // Default
};

/**
 * Formata o telefone a partir do DDD + número
 */
const formatTelefone = (dddTelefone: string): string | undefined => {
  if (!dddTelefone) return undefined;
  
  // Remove caracteres não numéricos
  const numeros = dddTelefone.replace(/\D/g, '');
  
  if (numeros.length < 10) return undefined;
  
  const ddd = numeros.substring(0, 2);
  const numero = numeros.substring(2);
  
  if (numero.length === 9) {
    return `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`;
  } else if (numero.length === 8) {
    return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
  }
  
  return `(${ddd}) ${numero}`;
};

/**
 * Formata o código CNAE para o padrão com traço
 */
const formatCnae = (codigo: number): string => {
  const str = codigo.toString().padStart(7, '0');
  return `${str.substring(0, 4)}-${str.substring(4, 5)}/${str.substring(5)}`;
};

/**
 * Consulta dados de um CNPJ na API da Receita Federal (via BrasilAPI)
 * 
 * @param cnpj - CNPJ com ou sem formatação
 * @returns Dados do CNPJ ou null se não encontrado
 * @throws Error em caso de falha na consulta
 */
export const consultarCNPJ = async (cnpj: string): Promise<DadosCNPJ | null> => {
  // Remove formatação do CNPJ
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) {
    throw new Error('CNPJ inválido. Deve conter 14 dígitos.');
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
    
    if (response.status === 404) {
      return null; // CNPJ não encontrado
    }
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Limite de consultas excedido. Aguarde alguns segundos e tente novamente.');
      }
      throw new Error(`Erro na consulta: ${response.status}`);
    }
    
    const data: BrasilAPIResponse = await response.json();
    
    // Mapeia a resposta da API para o formato interno
    const resultado: DadosCNPJ = {
      cnpj: data.cnpj,
      razaoSocial: data.razao_social,
      nomeFantasia: data.nome_fantasia || undefined,
      situacao: mapSituacao(data.descricao_situacao_cadastral),
      dataAbertura: data.data_inicio_atividade,
      naturezaJuridica: data.natureza_juridica,
      cnaePrincipal: {
        codigo: formatCnae(data.cnae_fiscal),
        descricao: data.cnae_fiscal_descricao,
      },
      cnaesSecundarios: (data.cnaes_secundarios || []).map(cnae => ({
        codigo: formatCnae(cnae.codigo),
        descricao: cnae.descricao,
      })),
      endereco: {
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || undefined,
        bairro: data.bairro,
        cidade: data.municipio,
        uf: data.uf,
        cep: data.cep,
      },
      telefone: formatTelefone(data.ddd_telefone_1) || formatTelefone(data.ddd_telefone_2),
      email: data.email || undefined,
      capitalSocial: data.capital_social,
      porte: data.descricao_porte || data.porte,
      optanteSimplesNacional: data.opcao_pelo_simples ?? undefined,
      optanteMei: data.opcao_pelo_mei ?? undefined,
    };
    
    return resultado;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao consultar CNPJ. Verifique sua conexão e tente novamente.');
  }
};

/**
 * Valida se um CNPJ é válido (apenas formato, não consulta online)
 */
export const validarCNPJ = (cnpj: string): boolean => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpjLimpo)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cnpjLimpo[12]) !== digito1) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;
  
  return parseInt(cnpjLimpo[13]) === digito2;
};

/**
 * Formata um CNPJ para exibição (XX.XXX.XXX/XXXX-XX)
 */
export const formatarCNPJ = (cnpj: string): string => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) return cnpj;
  
  return cnpjLimpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

export default {
  consultarCNPJ,
  validarCNPJ,
  formatarCNPJ,
};
