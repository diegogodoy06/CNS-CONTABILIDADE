import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { MainLayout } from './components/layout';
import type { RootState, AppDispatch } from './store';
import { 
  initializeAuth, 
  setInitialized, 
  loginSuccess, 
  logout 
} from './store/slices/authSlice';
import { authService } from './services/authService';

// Lazy load das páginas
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const ClientesPage = lazy(() => import('./features/clientes/pages/ClientesPage'));
const AlertasPage = lazy(() => import('./features/monitoramento/pages/AlertasPage'));
const ComunicadosPage = lazy(() => import('./features/comunicacao/pages/ComunicadosPage'));
const UsuariosPage = lazy(() => import('./features/usuarios/pages/UsuariosPage'));
const TicketsPage = lazy(() => import('./features/tickets/pages/TicketsPage'));
const NotasFiscaisPage = lazy(() => import('./features/notas-fiscais/pages/NotasFiscaisPage'));
const DocumentosGuiasPage = lazy(() => import('./features/documentos/pages/DocumentosGuiasPage'));
const RelatoriosPage = lazy(() => import('./features/relatorios/pages/RelatoriosPage'));
const EquipePage = lazy(() => import('./features/equipe/pages/EquipePage'));

// Loading fallback
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
    <CircularProgress />
    <Typography variant="body2" color="text.secondary">
      Carregando...
    </Typography>
  </Box>
);

// Componente que inicializa a autenticação verificando token com a API
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
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
        const user = await authService.getCurrentUser();
        const refreshToken = localStorage.getItem('admin_refreshToken') || '';
        
        dispatch(loginSuccess({
          user,
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
    return <LoadingFallback />;
  }

  return <>{children}</>;
};

// Componente de proteção de rotas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  
  if (!isInitialized) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Rota pública - redireciona para dashboard se já autenticado
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  
  if (!isInitialized) {
    return <LoadingFallback />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Página placeholder para rotas não implementadas
const PlaceholderPage = ({ title }: { title: string }) => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Box
        component="span"
        sx={{ fontSize: 64, mb: 2, display: 'block' }}
      >
        🚧
      </Box>
      <Box component="h2" sx={{ mb: 1 }}>
        {title}
      </Box>
      <Box component="p" sx={{ color: 'text.secondary' }}>
        Esta página está em desenvolvimento
      </Box>
    </Box>
  </Box>
);

function App() {
  return (
    <AuthInitializer>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Rota pública - Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<DashboardPage />} />
          
          {/* Clientes */}
          <Route path="clientes" element={<ClientesPage />} />
          
          {/* Gestão de Usuários Global */}
          <Route path="usuarios" element={<UsuariosPage />} />
          
          {/* Monitoramento */}
          <Route path="alertas" element={<AlertasPage />} />
          <Route path="guias-vencendo" element={<DocumentosGuiasPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          
          {/* Notas e Documentos */}
          <Route path="notas" element={<NotasFiscaisPage />} />
          <Route path="documentos" element={<DocumentosGuiasPage />} />
          
          {/* Comunicação */}
          <Route path="comunicados" element={<ComunicadosPage />} />
          <Route path="mensagens" element={<PlaceholderPage title="Mensagens" />} />
          
          {/* Relatórios */}
          <Route path="relatorios" element={<RelatoriosPage />} />
          
          {/* Configurações */}
          <Route path="equipe" element={<EquipePage />} />
          <Route path="configuracoes" element={<PlaceholderPage title="Configurações" />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
    </AuthInitializer>
  );
}

export default App;
