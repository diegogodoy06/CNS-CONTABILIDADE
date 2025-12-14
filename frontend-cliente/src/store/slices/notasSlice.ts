import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotaFiscal, NotaFiscalFilters, NotaFiscalStatus } from '../../types';

interface NotasState {
  notas: NotaFiscal[];
  rascunhos: NotaFiscal[];
  selectedNota: NotaFiscal | null;
  filters: NotaFiscalFilters;
  isLoading: boolean;
  isEmitting: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  limit: number;
  // Estatísticas
  stats: {
    totalEmitidas: number;
    totalRascunhos: number;
    faturamentoMes: number;
    variacao: number;
  };
}

const initialState: NotasState = {
  notas: [],
  rascunhos: [],
  selectedNota: null,
  filters: {},
  isLoading: false,
  isEmitting: false,
  error: null,
  totalCount: 0,
  page: 1,
  limit: 20,
  stats: {
    totalEmitidas: 0,
    totalRascunhos: 0,
    faturamentoMes: 0,
    variacao: 0,
  },
};

const notasSlice = createSlice({
  name: 'notas',
  initialState,
  reducers: {
    fetchNotasStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchNotasSuccess(
      state,
      action: PayloadAction<{ notas: NotaFiscal[]; total: number }>
    ) {
      state.isLoading = false;
      state.notas = action.payload.notas;
      state.totalCount = action.payload.total;
      state.error = null;
    },
    fetchNotasFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchRascunhosSuccess(state, action: PayloadAction<NotaFiscal[]>) {
      state.rascunhos = action.payload;
    },
    setSelectedNota(state, action: PayloadAction<NotaFiscal | null>) {
      state.selectedNota = action.payload;
    },
    setFilters(state, action: PayloadAction<NotaFiscalFilters>) {
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
    // Emissão
    emitirNotaStart(state) {
      state.isEmitting = true;
      state.error = null;
    },
    emitirNotaSuccess(state, action: PayloadAction<NotaFiscal>) {
      state.isEmitting = false;
      state.notas.unshift(action.payload);
      state.totalCount += 1;
      state.stats.totalEmitidas += 1;
      state.stats.faturamentoMes += action.payload.valores.valorServico;
      // Remove rascunho se existir
      state.rascunhos = state.rascunhos.filter(
        (r) => r.id !== action.payload.id
      );
    },
    emitirNotaFailure(state, action: PayloadAction<string>) {
      state.isEmitting = false;
      state.error = action.payload;
    },
    // Rascunho
    saveRascunhoSuccess(state, action: PayloadAction<NotaFiscal>) {
      const index = state.rascunhos.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rascunhos[index] = action.payload;
      } else {
        state.rascunhos.unshift(action.payload);
        state.stats.totalRascunhos += 1;
      }
    },
    deleteRascunho(state, action: PayloadAction<string>) {
      state.rascunhos = state.rascunhos.filter((r) => r.id !== action.payload);
      state.stats.totalRascunhos -= 1;
    },
    // Cancelamento
    cancelarNotaSuccess(state, action: PayloadAction<string>) {
      const nota = state.notas.find((n) => n.id === action.payload);
      if (nota) {
        nota.status = 'cancelada';
        state.stats.faturamentoMes -= nota.valores.valorServico;
      }
    },
    // Estatísticas
    updateStats(
      state,
      action: PayloadAction<{
        totalEmitidas: number;
        totalRascunhos: number;
        faturamentoMes: number;
        variacao: number;
      }>
    ) {
      state.stats = action.payload;
    },
    // Update nota status
    updateNotaStatus(
      state,
      action: PayloadAction<{ id: string; status: NotaFiscalStatus }>
    ) {
      const nota = state.notas.find((n) => n.id === action.payload.id);
      if (nota) {
        nota.status = action.payload.status;
      }
    },
    clearNotas(state) {
      state.notas = [];
      state.rascunhos = [];
      state.selectedNota = null;
      state.totalCount = 0;
      state.page = 1;
    },
  },
});

export const {
  fetchNotasStart,
  fetchNotasSuccess,
  fetchNotasFailure,
  fetchRascunhosSuccess,
  setSelectedNota,
  setFilters,
  clearFilters,
  setPage,
  emitirNotaStart,
  emitirNotaSuccess,
  emitirNotaFailure,
  saveRascunhoSuccess,
  deleteRascunho,
  cancelarNotaSuccess,
  updateStats,
  updateNotaStatus,
  clearNotas,
} = notasSlice.actions;

export default notasSlice.reducer;
