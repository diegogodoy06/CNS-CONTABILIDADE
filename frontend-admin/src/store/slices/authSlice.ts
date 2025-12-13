import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: {
    id: '1',
    nome: 'Carlos Silva',
    email: 'carlos.silva@cnscontabil.com.br',
    cargo: 'Contador Responsável',
  },
  isAuthenticated: true, // Mock: já logado
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
