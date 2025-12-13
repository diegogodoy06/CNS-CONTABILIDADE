import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  cidade: string;
  uf: string;
}

interface ClientesState {
  clientes: Cliente[];
  selectedCliente: Cliente | null;
  isLoading: boolean;
  filtros: {
    status: string;
    regime: string;
    busca: string;
  };
}

const initialState: ClientesState = {
  clientes: [],
  selectedCliente: null,
  isLoading: false,
  filtros: {
    status: 'todos',
    regime: 'todos',
    busca: '',
  },
};

const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    setClientes: (state, action: PayloadAction<Cliente[]>) => {
      state.clientes = action.payload;
    },
    setSelectedCliente: (state, action: PayloadAction<Cliente | null>) => {
      state.selectedCliente = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFiltros: (state, action: PayloadAction<Partial<ClientesState['filtros']>>) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    updateCliente: (state, action: PayloadAction<Cliente>) => {
      const index = state.clientes.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clientes[index] = action.payload;
      }
    },
  },
});

export const { 
  setClientes, 
  setSelectedCliente, 
  setLoading, 
  setFiltros,
  updateCliente 
} = clientesSlice.actions;
export default clientesSlice.reducer;
