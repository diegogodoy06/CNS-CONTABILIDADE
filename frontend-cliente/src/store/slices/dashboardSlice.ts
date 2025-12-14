import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DashboardStats, Guia, NotaFiscal, Document } from '../../types';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchStatsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchStatsSuccess(state, action: PayloadAction<DashboardStats>) {
      state.isLoading = false;
      state.stats = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    fetchStatsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateProximasObrigacoes(state, action: PayloadAction<Guia[]>) {
      if (state.stats) {
        state.stats.proximasObrigacoes = action.payload;
      }
    },
    updateNotasRecentes(state, action: PayloadAction<NotaFiscal[]>) {
      if (state.stats) {
        state.stats.notasRecentes = action.payload;
      }
    },
    updateDocumentosRecentes(state, action: PayloadAction<Document[]>) {
      if (state.stats) {
        state.stats.documentosRecentes = action.payload;
      }
    },
    clearDashboard(state) {
      state.stats = null;
      state.lastUpdated = null;
      state.error = null;
    },
  },
});

export const {
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
  updateProximasObrigacoes,
  updateNotasRecentes,
  updateDocumentosRecentes,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
