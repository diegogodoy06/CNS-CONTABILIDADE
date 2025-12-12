import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  darkMode: boolean;
  // Modals
  modals: {
    emitirNota: boolean;
    uploadDocumento: boolean;
    novoTomador: boolean;
    confirmarAcao: boolean;
  };
  // Snackbar/Toast
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    autoHideDuration?: number;
  };
  // Loading global
  globalLoading: boolean;
  // Breadcrumbs
  breadcrumbs: { label: string; path?: string }[];
}

const initialState: UiState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  darkMode: localStorage.getItem('darkMode') === 'true',
  modals: {
    emitirNota: false,
    uploadDocumento: false,
    novoTomador: false,
    confirmarAcao: false,
  },
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000,
  },
  globalLoading: false,
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarMobile(state) {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
    setSidebarMobileOpen(state, action: PayloadAction<boolean>) {
      state.sidebarMobileOpen = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(state.darkMode));
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', String(action.payload));
    },
    // Modals
    openModal(
      state,
      action: PayloadAction<keyof UiState['modals']>
    ) {
      state.modals[action.payload] = true;
    },
    closeModal(
      state,
      action: PayloadAction<keyof UiState['modals']>
    ) {
      state.modals[action.payload] = false;
    },
    closeAllModals(state) {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UiState['modals']] = false;
      });
    },
    // Snackbar
    showSnackbar(
      state,
      action: PayloadAction<{
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
        autoHideDuration?: number;
      }>
    ) {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
        autoHideDuration: action.payload.autoHideDuration ?? 6000,
      };
    },
    hideSnackbar(state) {
      state.snackbar.open = false;
    },
    // Global loading
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    // Breadcrumbs
    setBreadcrumbs(
      state,
      action: PayloadAction<{ label: string; path?: string }[]>
    ) {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb(
      state,
      action: PayloadAction<{ label: string; path?: string }>
    ) {
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs(state) {
      state.breadcrumbs = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarMobile,
  setSidebarMobileOpen,
  toggleDarkMode,
  setDarkMode,
  openModal,
  closeModal,
  closeAllModals,
  showSnackbar,
  hideSnackbar,
  setGlobalLoading,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
} = uiSlice.actions;

export default uiSlice.reducer;
