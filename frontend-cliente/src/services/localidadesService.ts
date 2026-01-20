import api from './api';

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

export interface Municipio {
  codigo: number;
  nome: string;
  nomeCompleto: string;
  estado: Estado;
}

const localidadesService = {
  /**
   * Busca estado por sigla (UF)
   */
  async buscarEstado(uf: string): Promise<Estado | null> {
    const sigla = uf.trim().toUpperCase();
    if (!sigla) return null;
    const response = await api.get(`/localidades/estados/${sigla}`);
    return response.data?.data || response.data || null;
  },

  /**
   * Busca municípios por termo e UF
   */
  async buscarMunicipios(termo: string, uf: string, limit = 20): Promise<Municipio[]> {
    const params = { termo, uf: uf.trim().toUpperCase(), limit };
    const response = await api.get('/localidades/municipios', { params });
    return response.data?.data || response.data || [];
  },
};

export default localidadesService;
