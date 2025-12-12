import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Guia, GuiaFilters, GuiaStatus } from '../../types';

interface GuiasState {
  guias: Guia[];
  selectedGuia: Guia | null;
  filters: GuiaFilters;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  limit: number;
  // Resumo
  resumo: {
    pendentes: number;
    vencidas: number;
    pagas: number;
    totalPendente: number;
    totalPago: number;
  };
  // Próximos vencimentos
  proximosVencimentos: Guia[];
}

const initialState: GuiasState = {
  guias: [],
  selectedGuia: null,
  filters: {},
  isLoading: false,
  error: null,
  totalCount: 0,
  page: 1,
  limit: 20,
  resumo: {
    pendentes: 0,
    vencidas: 0,
    pagas: 0,
    totalPendente: 0,
    totalPago: 0,
  },
  proximosVencimentos: [],
};

const guiasSlice = createSlice({
  name: 'guias',
  initialState,
  reducers: {
    fetchGuiasStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchGuiasSuccess(
      state,
      action: PayloadAction<{ guias: Guia[]; total: number }>
    ) {
      state.isLoading = false;
      state.guias = action.payload.guias;
      state.totalCount = action.payload.total;
      state.error = null;
    },
    fetchGuiasFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedGuia(state, action: PayloadAction<Guia | null>) {
      state.selectedGuia = action.payload;
    },
    setFilters(state, action: PayloadAction<GuiaFilters>) {
      state.filters = action.payload;
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    // Atualizar status da guia
    updateGuiaStatus(
      state,
      action: PayloadAction<{ id: string; status: GuiaStatus; dataPagamento?: string }>
    ) {
      const guia = state.guias.find((g) => g.id === action.payload.id);
      if (guia) {
        guia.status = action.payload.status;
        if (action.payload.dataPagamento) {
          guia.dataPagamento = action.payload.dataPagamento;
        }
      }
      // Atualizar resumo
      state.resumo = calcularResumo(state.guias);
    },
    // Upload de comprovante
    uploadComprovanteSuccess(
      state,
      action: PayloadAction<{ id: string; comprovanteUrl: string }>
    ) {
      const guia = state.guias.find((g) => g.id === action.payload.id);
      if (guia) {
        guia.comprovanteUrl = action.payload.comprovanteUrl;
      }
    },
    // Resumo
    updateResumo(
      state,
      action: PayloadAction<{
        pendentes: number;
        vencidas: number;
        pagas: number;
        totalPendente: number;
        totalPago: number;
      }>
    ) {
      state.resumo = action.payload;
    },
    // Próximos vencimentos
    updateProximosVencimentos(state, action: PayloadAction<Guia[]>) {
      state.proximosVencimentos = action.payload;
    },
    // Adicionar guia (quando contador envia)
    addGuia(state, action: PayloadAction<Guia>) {
      state.guias.unshift(action.payload);
      state.totalCount += 1;
      state.resumo = calcularResumo(state.guias);
    },
    clearGuias(state) {
      state.guias = [];
      state.selectedGuia = null;
      state.totalCount = 0;
      state.page = 1;
    },
  },
});

// Helper para calcular resumo
function calcularResumo(guias: Guia[]) {
  const pendentes = guias.filter((g) => g.status === 'pendente').length;
  const vencidas = guias.filter((g) => g.status === 'vencida').length;
  const pagas = guias.filter((g) => g.status === 'paga').length;
  const totalPendente = guias
    .filter((g) => g.status === 'pendente' || g.status === 'vencida')
    .reduce((sum, g) => sum + g.valor, 0);
  const totalPago = guias
    .filter((g) => g.status === 'paga')
    .reduce((sum, g) => sum + g.valor, 0);

  return { pendentes, vencidas, pagas, totalPendente, totalPago };
}

export const {
  fetchGuiasStart,
  fetchGuiasSuccess,
  fetchGuiasFailure,
  setSelectedGuia,
  setFilters,
  clearFilters,
  setPage,
  updateGuiaStatus,
  uploadComprovanteSuccess,
  updateResumo,
  updateProximosVencimentos,
  addGuia,
  clearGuias,
} = guiasSlice.actions;

export default guiasSlice.reducer;
