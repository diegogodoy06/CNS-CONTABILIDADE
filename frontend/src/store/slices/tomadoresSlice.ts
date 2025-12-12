import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Tomador, TomadorFilters } from '../../types';

interface TomadoresState {
  tomadores: Tomador[];
  selectedTomador: Tomador | null;
  filters: TomadorFilters;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  limit: number;
  // Últimos utilizados (quick access)
  recentes: Tomador[];
  // Tags disponíveis
  tags: string[];
}

const initialState: TomadoresState = {
  tomadores: [],
  selectedTomador: null,
  filters: {},
  isLoading: false,
  isSaving: false,
  error: null,
  totalCount: 0,
  page: 1,
  limit: 20,
  recentes: [],
  tags: ['Recorrentes', 'VIP', 'Inativos', 'Novos'],
};

const tomadoresSlice = createSlice({
  name: 'tomadores',
  initialState,
  reducers: {
    fetchTomadoresStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchTomadoresSuccess(
      state,
      action: PayloadAction<{ tomadores: Tomador[]; total: number }>
    ) {
      state.isLoading = false;
      state.tomadores = action.payload.tomadores;
      state.totalCount = action.payload.total;
      state.error = null;
    },
    fetchTomadoresFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedTomador(state, action: PayloadAction<Tomador | null>) {
      state.selectedTomador = action.payload;
    },
    setFilters(state, action: PayloadAction<TomadorFilters>) {
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
    // CRUD
    saveTomadorStart(state) {
      state.isSaving = true;
      state.error = null;
    },
    saveTomadorSuccess(state, action: PayloadAction<Tomador>) {
      state.isSaving = false;
      const index = state.tomadores.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tomadores[index] = action.payload;
      } else {
        state.tomadores.unshift(action.payload);
        state.totalCount += 1;
      }
      state.selectedTomador = action.payload;
    },
    saveTomadorFailure(state, action: PayloadAction<string>) {
      state.isSaving = false;
      state.error = action.payload;
    },
    deleteTomador(state, action: PayloadAction<string>) {
      // Soft delete - apenas desativa
      const tomador = state.tomadores.find((t) => t.id === action.payload);
      if (tomador) {
        tomador.ativo = false;
      }
    },
    // Recentes
    updateRecentes(state, action: PayloadAction<Tomador[]>) {
      state.recentes = action.payload.slice(0, 5);
    },
    addToRecentes(state, action: PayloadAction<Tomador>) {
      // Remove se já existir
      state.recentes = state.recentes.filter((t) => t.id !== action.payload.id);
      // Adiciona no início
      state.recentes.unshift(action.payload);
      // Mantém apenas 5
      state.recentes = state.recentes.slice(0, 5);
    },
    // Tags
    addTag(state, action: PayloadAction<string>) {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
      }
    },
    // Atualizar tags do tomador
    updateTomadorTags(
      state,
      action: PayloadAction<{ id: string; tags: string[] }>
    ) {
      const tomador = state.tomadores.find((t) => t.id === action.payload.id);
      if (tomador) {
        tomador.tags = action.payload.tags;
      }
    },
    // Atualizar estatísticas do tomador após emissão de nota
    updateTomadorStats(
      state,
      action: PayloadAction<{
        id: string;
        valorNota: number;
        dataEmissao: string;
      }>
    ) {
      const tomador = state.tomadores.find((t) => t.id === action.payload.id);
      if (tomador) {
        tomador.totalNotas += 1;
        tomador.faturamentoTotal += action.payload.valorNota;
        tomador.ultimaNotaEmitida = action.payload.dataEmissao;
      }
    },
    clearTomadores(state) {
      state.tomadores = [];
      state.selectedTomador = null;
      state.totalCount = 0;
      state.page = 1;
    },
  },
});

export const {
  fetchTomadoresStart,
  fetchTomadoresSuccess,
  fetchTomadoresFailure,
  setSelectedTomador,
  setFilters,
  clearFilters,
  setPage,
  saveTomadorStart,
  saveTomadorSuccess,
  saveTomadorFailure,
  deleteTomador,
  updateRecentes,
  addToRecentes,
  addTag,
  updateTomadorTags,
  updateTomadorStats,
  clearTomadores,
} = tomadoresSlice.actions;

export default tomadoresSlice.reducer;
