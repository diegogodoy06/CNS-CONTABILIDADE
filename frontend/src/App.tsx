import React, { useMemo } from 'react';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline, CircularProgress, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ptBR } from 'date-fns/locale';

import { store } from './store';
import type { RootState } from './store';
import { createAppTheme } from './theme';
import { MainLayout } from './components/layout';

// Lazy loaded pages
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const RecuperarSenhaPage = lazy(() => import('./features/auth/pages/RecuperarSenhaPage'));
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const DocumentsPage = lazy(() => import('./features/documents/pages/DocumentsPage'));
const NotasPage = lazy(() => import('./features/notas/pages/NotasPage'));
const EmitirNotaPage = lazy(() => import('./features/notas/pages/EmitirNotaPage'));
const GuiasPage = lazy(() => import('./features/guias/pages/GuiasPage'));
const TomadoresPage = lazy(() => import('./features/tomadores/pages/TomadoresPage'));
const CalendarioPage = lazy(() => import('./features/calendario/pages/CalendarioPage'));
const NotificationSettingsPage = lazy(() => import('./features/notifications/pages/NotificationSettingsPage'));
const NotificationHistoryPage = lazy(() => import('./features/notifications/pages/NotificationHistoryPage'));
const RelatoriosPage = lazy(() => import('./features/relatorios/pages/RelatoriosPage'));
const ConfiguracoesPage = lazy(() => import('./features/configuracoes/pages/ConfiguracoesPage'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      bgcolor: 'grey.50',
    }}
  >
    <CircularProgress />
  </Box>
);

// Auth guard component
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // TODO: Replace with actual auth check from Redux store
  const isAuthenticated = true; // Temporarily always authenticated for development
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public route - redirects to dashboard if already authenticated
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // TODO: Replace with actual auth check from Redux store
  const isAuthenticated = true; // Set to true to skip login and go to dashboard
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Temporary placeholder for future pages
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60vh',
      textAlign: 'center',
    }}
  >
    <Typography variant="h1" sx={{ fontSize: 64, mb: 2 }}>
      🚧
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
      Esta funcionalidade está em desenvolvimento.
    </Typography>
  </Box>
);

// Componente interno que usa o tema baseado no Redux
const AppContent: React.FC = () => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const theme = useMemo(() => createAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/recuperar-senha"
                element={
                  <PublicRoute>
                    <RecuperarSenhaPage />
                  </PublicRoute>
                }
              />
              
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="documentos" element={<DocumentsPage />} />
                <Route path="notas" element={<NotasPage />} />
                <Route path="notas/emitir" element={<EmitirNotaPage />} />
                <Route path="guias" element={<GuiasPage />} />
                <Route path="tomadores" element={<TomadoresPage />} />
                <Route path="calendario" element={<CalendarioPage />} />
                <Route path="notificacoes" element={<NotificationHistoryPage />} />
                <Route path="configuracoes/notificacoes" element={<NotificationSettingsPage />} />
                
                {/* Relatórios */}
                <Route path="relatorios" element={<RelatoriosPage />} />
                
                {/* Configurações */}
                <Route path="configuracoes" element={<ConfiguracoesPage />} />
                
                {/* Future routes */}
                <Route path="ajuda" element={<ComingSoon title="Central de Ajuda" />} />
                <Route path="perfil" element={<ComingSoon title="Meu Perfil" />} />
                
                {/* 404 inside authenticated area */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              
              {/* Redirect unknown routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
