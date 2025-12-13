import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface AtividadeRecente {
  id: string;
  tipo: 'nota_emitida' | 'documento_upload' | 'ticket_aberto' | 'guia_paga' | 'login';
  descricao: string;
  clienteId: string;
  clienteNome: string;
  dataHora: string;
}

interface MonitoramentoState {
  alertas: Alerta[];
  atividadesRecentes: AtividadeRecente[];
  metricas: {
    totalClientes: number;
    clientesAtivos: number;
    clientesInadimplentes: number;
    guiasVencendo: number;
    ticketsAbertos: number;
    notasHoje: number;
    faturamentoMes: number;
  };
  isLoading: boolean;
}

const initialState: MonitoramentoState = {
  alertas: [],
  atividadesRecentes: [],
  metricas: {
    totalClientes: 0,
    clientesAtivos: 0,
    clientesInadimplentes: 0,
    guiasVencendo: 0,
    ticketsAbertos: 0,
    notasHoje: 0,
    faturamentoMes: 0,
  },
  isLoading: false,
};

const monitoramentoSlice = createSlice({
  name: 'monitoramento',
  initialState,
  reducers: {
    setAlertas: (state, action: PayloadAction<Alerta[]>) => {
      state.alertas = action.payload;
    },
    setAtividadesRecentes: (state, action: PayloadAction<AtividadeRecente[]>) => {
      state.atividadesRecentes = action.payload;
    },
    setMetricas: (state, action: PayloadAction<MonitoramentoState['metricas']>) => {
      state.metricas = action.payload;
    },
    marcarAlertaLido: (state, action: PayloadAction<string>) => {
      const alerta = state.alertas.find(a => a.id === action.payload);
      if (alerta) {
        alerta.lido = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { 
  setAlertas, 
  setAtividadesRecentes, 
  setMetricas, 
  marcarAlertaLido,
  setLoading 
} = monitoramentoSlice.actions;
export default monitoramentoSlice.reducer;
