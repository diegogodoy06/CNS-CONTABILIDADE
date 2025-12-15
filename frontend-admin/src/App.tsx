import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { MainLayout } from './components/layout';

// Lazy load das páginas
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
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

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
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
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
  );
}

export default App;
