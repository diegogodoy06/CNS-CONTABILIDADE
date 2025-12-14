import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Company } from '../../types';

interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: string | null;
}

const initialState: AuthState = {
  user: null,
  company: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  sessionExpiry: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        user: User;
        company: Company;
        token: string;
        refreshToken: string;
      }>
    ) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.company = action.payload.company;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      
      // Persist tokens
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.user = null;
      state.company = null;
      state.token = null;
      state.refreshToken = null;
    },
    logout(state) {
      state.user = null;
      state.company = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.sessionExpiry = null;
      
      // Clear persisted tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    updateToken(state, action: PayloadAction<{ token: string; refreshToken: string }>) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setCompany(state, action: PayloadAction<Company>) {
      state.company = action.payload;
    },
    setSessionExpiry(state, action: PayloadAction<string>) {
      state.sessionExpiry = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateToken,
  setUser,
  setCompany,
  setSessionExpiry,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
