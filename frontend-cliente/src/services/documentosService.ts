import api from './api';
import type { Document, DocumentCategory, DocumentFilters } from '../types';

export interface PaginatedDocuments {
  items: Document[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Mapeamento de categorias do frontend para tipos do backend
const categoryToTipoBackend: Record<DocumentCategory, string> = {
  fiscal: 'NOTA_FISCAL',
  contabil: 'BALANCO',
  trabalhista: 'GUIA',
  juridico: 'CONTRATO_SOCIAL',
  operacional: 'COMPROVANTE',
  certificados: 'CERTIFICADO_DIGITAL',
  modelos: 'OUTROS',
};

// Mapeamento inverso de tipos do backend para categorias do frontend
const tipoBackendToCategory: Record<string, DocumentCategory> = {
  CONTRATO_SOCIAL: 'juridico',
  ALTERACAO_CONTRATUAL: 'juridico',
  BALANCO: 'contabil',
  DRE: 'contabil',
  LIVRO_CAIXA: 'contabil',
  PROCURACAO: 'juridico',
  CERTIFICADO_DIGITAL: 'certificados',
  COMPROVANTE: 'operacional',
  NOTA_FISCAL: 'fiscal',
  GUIA: 'trabalhista',
  OUTROS: 'modelos',
};

export interface CreateDocumentoDto {
  empresaId: string;
  tipo: DocumentCategory;
  titulo: string;
  descricao?: string;
  documentoOriginalId?: string;
}

export interface UpdateDocumentoDto {
  titulo?: string;
  descricao?: string;
  tipo?: DocumentCategory;
  tags?: string[];
  privado?: boolean;
  compartilhadoContador?: boolean;
}

// Tipo para log de acesso
export interface AcessoLog {
  id: string;
  acao: string;
  usuario: string;
  data: string;
  ip: string;
}

// Mapeamento de ações do backend para labels legíveis
function mapAcaoToLabel(acao: string): string {
  const acaoMap: Record<string, string> = {
    'CREATE': 'Upload',
    'READ': 'Visualização',
    'UPDATE': 'Edição',
    'DELETE': 'Exclusão',
    'DOWNLOAD': 'Download',
  };
  return acaoMap[acao] || acao;
}

interface FilterParams extends DocumentFilters {
  empresaId?: string;
  page?: number;
  limit?: number;
}

// Mapear resposta do backend para o formato do frontend
const mapDocumentoResponse = (data: any): Document => {
  return {
    id: data.id,
    nome: data.titulo || data.nomeArquivo,
    categoria: tipoBackendToCategory[data.tipo] || 'operacional',
    subcategoria: undefined,
    dataUpload: data.criadoEm,
    dataReferencia: data.dataReferencia,
    competencia: data.competencia,
    tamanho: parseInt(data.tamanhoBytes) || 0,
    formato: data.nomeArquivo?.split('.').pop() || 'pdf',
    url: data.caminhoArquivo || '',
    tags: data.tags || [],
    uploadedBy: data.criadoPorId || '',
    visualizado: data.visualizado || false,
    compartilhadoContador: data.compartilhadoContador || false,
    privado: data.privado || false,
    versao: data.versao || 1,
    versaoAnterior: data.documentoOriginalId,
  };
};

// Mapear parâmetros de filtro do frontend para o formato do backend
const mapFilterParams = (params?: FilterParams): Record<string, any> => {
  if (!params) return {};
  
  const mapped: Record<string, any> = {};
  
  // Campos de paginação
  if (params.empresaId) mapped.empresaId = params.empresaId;
  if (params.page) mapped.page = params.page;
  // Backend usa perPage, não limit
  if (params.limit) mapped.perPage = params.limit;
  
  // Mapear categoria do frontend para tipo do backend
  if (params.categoria) {
    mapped.tipo = categoryToTipoBackend[params.categoria] || 'OUTROS';
  }
  
  // Busca
  if (params.busca) mapped.busca = params.busca;
  
  return mapped;
};

const documentosService = {
  /**
   * Lista documentos com filtros e paginação
   */
  async findAll(params?: FilterParams): Promise<PaginatedDocuments> {
    const mappedParams = mapFilterParams(params);
    const response = await api.get('/documentos', { params: mappedParams });
    
    // A API retorna: { success, data: [...], meta: {...} }
    // OU pode retornar: { success, data: { items: [...], meta: {...} } }
    const responseData = response.data;
    
    // Determina se data é array direto ou objeto com items
    let itemsSource: any[] = [];
    let meta = {
      total: 0,
      page: params?.page || 1,
      perPage: params?.limit || 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
    
    if (Array.isArray(responseData.data)) {
      // Formato: { data: [...], meta: {...} }
      itemsSource = responseData.data;
      meta = responseData.meta || meta;
    } else if (responseData.data?.items) {
      // Formato: { data: { items: [...], meta: {...} } }
      itemsSource = responseData.data.items;
      meta = responseData.data.meta || meta;
    }
    
    return {
      items: itemsSource.map(mapDocumentoResponse),
      meta,
    };
  },

  /**
   * Busca documento por ID
   */
  async findOne(id: string): Promise<Document> {
    const response = await api.get(`/documentos/${id}`);
    return mapDocumentoResponse(response.data.data);
  },

  /**
   * Faz upload de um documento
   */
  async upload(
    file: File,
    data: CreateDocumentoDto,
    onProgress?: (progress: number) => void
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('arquivo', file);
    formData.append('empresaId', data.empresaId);
    // Mapear categoria para tipo do backend
    formData.append('tipo', categoryToTipoBackend[data.tipo] || 'OUTROS');
    formData.append('titulo', data.titulo);
    if (data.descricao) {
      formData.append('descricao', data.descricao);
    }
    if (data.documentoOriginalId) {
      formData.append('documentoOriginalId', data.documentoOriginalId);
    }

    const response = await api.post('/documentos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return mapDocumentoResponse(response.data.data);
  },

  /**
   * Atualiza metadados do documento
   */
  async update(id: string, data: UpdateDocumentoDto): Promise<Document> {
    const mapped: Record<string, any> = {};
    
    if (data.titulo) mapped.titulo = data.titulo;
    if (data.descricao !== undefined) mapped.descricao = data.descricao;
    if (data.tipo) mapped.tipo = categoryToTipoBackend[data.tipo] || 'OUTROS';
    if (data.tags) mapped.tags = data.tags;
    if (data.privado !== undefined) mapped.privado = data.privado;
    if (data.compartilhadoContador !== undefined) mapped.compartilhadoContador = data.compartilhadoContador;
    
    const response = await api.patch(`/documentos/${id}`, mapped);
    return mapDocumentoResponse(response.data.data);
  },

  /**
   * Remove documento (soft delete)
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/documentos/${id}`);
  },

  /**
   * Download do documento - retorna informações para download
   */
  async download(id: string): Promise<{ url: string; nomeArquivo: string; mimeType: string }> {
    const response = await api.get(`/documentos/${id}/download`);
    return response.data.data || response.data;
  },

  /**
   * Faz download do blob do documento (para download direto no navegador)
   */
  async downloadBlob(id: string): Promise<Blob> {
    const info = await documentosService.download(id);
    // Em produção, a URL seria uma URL assinada do S3
    // Por enquanto, retornamos um blob vazio já que o backend não serve o arquivo diretamente
    const response = await fetch(info.url);
    return response.blob();
  },

  /**
   * Arquiva documento
   */
  async arquivar(id: string): Promise<Document> {
    const response = await api.post(`/documentos/${id}/arquivar`);
    return mapDocumentoResponse(response.data.data);
  },

  /**
   * Obtém estatísticas de documentos por categoria
   */
  async getStats(empresaId: string): Promise<Record<DocumentCategory, number>> {
    const response = await documentosService.findAll({
      empresaId,
      limit: 1000, // Buscar todos para contar
    });
    
    const counts: Record<DocumentCategory, number> = {
      fiscal: 0,
      contabil: 0,
      trabalhista: 0,
      juridico: 0,
      operacional: 0,
      certificados: 0,
      modelos: 0,
    };
    
    response.items.forEach(doc => {
      if (doc.categoria && counts[doc.categoria] !== undefined) {
        counts[doc.categoria]++;
      }
    });
    
    return counts;
  },

  /**
   * Compartilha documento com o contador
   */
  async compartilharComContador(id: string): Promise<Document> {
    return documentosService.update(id, { compartilhadoContador: true });
  },

  /**
   * Verifica se um documento existe pelo hash (evitar duplicatas)
   */
  async verificarDuplicata(empresaId: string, nomeArquivo: string): Promise<Document | null> {
    try {
      const response = await documentosService.findAll({
        empresaId,
        busca: nomeArquivo,
        limit: 1,
      });
      return response.items[0] || null;
    } catch {
      return null;
    }
  },

  /**
   * Busca histórico de acessos de um documento
   */
  async getHistorico(documentoId: string): Promise<AcessoLog[]> {
    const response = await api.get(`/documentos/${documentoId}/historico`);
    const acessos = response.data || [];
    
    return acessos.map((acesso: any) => ({
      id: acesso.id,
      acao: mapAcaoToLabel(acesso.acao),
      usuario: acesso.usuario?.nome || 'Desconhecido',
      data: acesso.data,
      ip: acesso.ip || '-',
    }));
  },
};

export default documentosService;
