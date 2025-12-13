import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../store/hooks';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 72;

const MainLayout = () => {
  const { sidebarCollapsed } = useAppSelector(state => state.ui);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH}px)`,
          transition: 'width 0.2s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
