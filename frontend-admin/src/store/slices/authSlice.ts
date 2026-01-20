import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  tipo: 'ADMIN_SISTEMA' | 'ADMIN_ESCRITORIO' | 'COLABORADOR';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Recuperar dados do localStorage
const storedToken = localStorage.getItem('admin_token');
const storedRefreshToken = localStorage.getItem('admin_refreshToken');

const initialState: AuthState = {
  user: null,
  token: storedToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: false, // Começa como false - será validado na inicialização
  isLoading: false,
  isInitialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      state.isLoading = true;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      state.isLoading = false;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;

      // Persistir no localStorage
      localStorage.setItem('admin_token', action.payload.token);
      localStorage.setItem('admin_refreshToken', action.payload.refreshToken);
      localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('admin_user', JSON.stringify(action.payload));
      }
    },
    updateToken: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;

      localStorage.setItem('admin_token', action.payload.token);
      localStorage.setItem('admin_refreshToken', action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Limpar localStorage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refreshToken');
      localStorage.removeItem('admin_user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initializeAuth,
  setInitialized,
  loginStart,
  loginSuccess,
  loginFailure,
  setUser,
  updateToken,
  logout,
  setLoading,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
