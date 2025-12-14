// Serviço de consulta de CEP via ViaCEP API
export interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface EnderecoFormatado {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  codigoMunicipio: string;
}

export const cepService = {
  /**
   * Consulta endereço pelo CEP usando a API ViaCEP
   * @param cep CEP sem formatação (apenas números)
   * @returns Endereço formatado ou null se não encontrado
   */
  async consultar(cep: string): Promise<EnderecoFormatado | null> {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }

      const data: EnderecoViaCEP = await response.json();
      
      if (data.erro) {
        return null;
      }

      return {
        cep: data.cep.replace('-', ''),
        logradouro: data.logradouro,
        complemento: data.complemento || '',
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
        codigoMunicipio: data.ibge,
      };
    } catch (error) {
      console.error('Erro ao consultar CEP:', error);
      throw error;
    }
  },

  /**
   * Formata CEP para exibição (00000-000)
   */
  formatar(cep: string): string {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return cep;
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  },

  /**
   * Valida se o CEP tem formato válido
   */
  validar(cep: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
  },
};

export default cepService;
