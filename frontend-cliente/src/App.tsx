import React, { useMemo, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, CssBaseline, CircularProgress, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ptBR } from 'date-fns/locale';

import { store } from './store';
import type { RootState, AppDispatch } from './store';
import { createAppTheme } from './theme';
import { MainLayout } from './components/layout';
import { 
  initializeAuth, 
  setInitialized, 
  loginSuccess, 
  logout 
} from './store/slices/authSlice';
import authService from './services/authService';

// Lazy loaded pages
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const RecuperarSenhaPage = lazy(() => import('./features/auth/pages/RecuperarSenhaPage'));
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const DocumentsPage = lazy(() => import('./features/documents/pages/DocumentsPage'));
const NotasPage = lazy(() => import('./features/notas/pages/NotasPage'));
const EmitirNotaPage = lazy(() => import('./features/notas/pages/EmitirNotaPage'));
// RascunhosPage removida - unificada com NotasPage (aba 2)
const GuiasPage = lazy(() => import('./features/guias/pages/GuiasPage'));
const TomadoresPage = lazy(() => import('./features/tomadores/pages/TomadoresPage'));
const CalendarioPage = lazy(() => import('./features/calendario/pages/CalendarioPage'));
const NotificationSettingsPage = lazy(() => import('./features/notifications/pages/NotificationSettingsPage'));
const NotificationHistoryPage = lazy(() => import('./features/notifications/pages/NotificationHistoryPage'));
const RelatoriosPage = lazy(() => import('./features/relatorios/pages/RelatoriosPage'));
const ConfiguracoesPage = lazy(() => import('./features/configuracoes/pages/ConfiguracoesPage'));
const MensagensPage = lazy(() => import('./features/comunicacao/pages/MensagensPage'));
const TicketsPage = lazy(() => import('./features/comunicacao/pages/TicketsPage'));
const AjudaPage = lazy(() => import('./features/comunicacao/pages/AjudaPage'));
const UsuariosPage = lazy(() => import('./features/usuarios/pages/UsuariosPage'));
const DispositivosPage = lazy(() => import('./features/auth/pages/DispositivosPage'));
const PerfilPage = lazy(() => import('./features/perfil/pages/PerfilPage'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      bgcolor: 'grey.50',
      gap: 2,
    }}
  >
    <CircularProgress />
    <Typography variant="body2" color="text.secondary">
      Carregando...
    </Typography>
  </Box>
);

// Componente que inicializa a autenticação verificando token com a API
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      // Se não há token, marca como inicializado e não autenticado
      if (!token) {
        dispatch(setInitialized(true));
        return;
      }

      dispatch(initializeAuth());
      
      try {
        // Verifica se o token é válido buscando os dados do usuário
        const { user, company } = await authService.getCurrentUser();
        const refreshToken = localStorage.getItem('refreshToken') || '';
        
        dispatch(loginSuccess({
          user,
          company,
          token,
          refreshToken,
        }));
        dispatch(setInitialized(true));
      } catch (error) {
        console.warn('Token inválido ou expirado:', error);
        // Token inválido - faz logout
        dispatch(logout());
        dispatch(setInitialized(true));
      }
    };

    initAuth();
  }, [dispatch, token]);

  // Mostra loading enquanto verifica o token
  if (!isInitialized) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

// Auth guard component
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  
  // Se ainda não inicializou, mostra loading
  if (!isInitialized) {
    return <PageLoader />;
  }
  
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
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  
  // Se ainda não inicializou, mostra loading
  if (!isInitialized) {
    return <PageLoader />;
  }
  
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
          <AuthInitializer>
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
                <Route path="notas/rascunhos" element={<Navigate to="/notas?tab=rascunhos" replace />} />
                <Route path="guias" element={<GuiasPage />} />
                <Route path="tomadores" element={<TomadoresPage />} />
                <Route path="calendario" element={<CalendarioPage />} />
                <Route path="notificacoes" element={<NotificationHistoryPage />} />
                <Route path="configuracoes/notificacoes" element={<NotificationSettingsPage />} />
                
                {/* Relatórios */}
                <Route path="relatorios" element={<RelatoriosPage />} />
                
                {/* Configurações */}
                <Route path="configuracoes" element={<ConfiguracoesPage />} />
                
                {/* Comunicação */}
                <Route path="mensagens" element={<MensagensPage />} />
                <Route path="tickets" element={<TicketsPage />} />
                <Route path="ajuda" element={<AjudaPage />} />
                
                {/* Gestão de Usuários */}
                <Route path="usuarios" element={<UsuariosPage />} />
                
                {/* Segurança */}
                <Route path="seguranca/dispositivos" element={<DispositivosPage />} />
                
                {/* Perfil do Usuário */}
                <Route path="perfil" element={<PerfilPage />} />
                
                {/* 404 inside authenticated area */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              
              {/* Redirect unknown routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </AuthInitializer>
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
