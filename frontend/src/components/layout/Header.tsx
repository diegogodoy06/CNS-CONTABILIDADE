import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  Person,
  Settings,
  Logout,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { toggleSidebarMobile, toggleDarkMode } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const { user } = useAppSelector((state: RootState) => state.auth);
  const { sidebarCollapsed, darkMode } = useAppSelector((state: RootState) => state.ui);
  const { unreadCount } = useAppSelector((state: RootState) => state.notifications);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState<null | HTMLElement>(null);

  // Get page title based on route
  const getPageTitle = () => {
    const routes: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/notas': 'Notas Fiscais',
      '/guias': 'Guias e Impostos',
      '/documentos': 'Documentos',
      '/tomadores': 'Tomadores',
      '/relatorios': 'Relatórios',
      '/configuracoes': 'Configurações',
    };
    const basePath = '/' + location.pathname.split('/')[1];
    return routes[basePath] || 'Dashboard';
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const drawerWidth = sidebarCollapsed && !isMobile ? 72 : 280;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => dispatch(toggleSidebarMobile())}
          sx={{
            display: { lg: 'none' },
            color: 'text.primary',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {getPageTitle()}
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            bgcolor: 'grey.50',
            borderRadius: 1,
            px: 2,
            py: 0.5,
            border: '1px solid',
            borderColor: 'grey.200',
            '&:focus-within': {
              borderColor: 'primary.main',
              bgcolor: 'background.paper',
            },
          }}
        >
          <Search sx={{ color: 'grey.400', mr: 1 }} />
          <InputBase
            placeholder="Pesquisar..."
            sx={{
              color: 'text.primary',
              '& input': {
                width: 200,
                transition: 'width 0.2s',
                '&:focus': {
                  width: 280,
                },
              },
            }}
          />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', md: 'block' } }} />

        {/* Dark Mode Toggle */}
        <Tooltip title={darkMode ? 'Modo claro' : 'Modo escuro'}>
          <IconButton onClick={() => dispatch(toggleDarkMode())} sx={{ color: 'text.secondary' }}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notificações">
          <IconButton
            onClick={handleNotificationsOpen}
            sx={{ color: 'text.secondary' }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Profile Menu */}
        <Tooltip title="Perfil">
          <IconButton onClick={handleProfileMenuOpen} size="small">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 220, mt: 1 },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.name || 'Usuário'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'email@exemplo.com'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); navigate('/perfil'); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/configuracoes'); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 360, maxHeight: 400, mt: 1 },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Notificações
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Marcar todas como lidas
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nenhuma notificação
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => { handleNotificationsClose(); navigate('/notificacoes'); }}
          sx={{ justifyContent: 'center' }}
        >
          <Typography variant="body2" color="primary">
            Ver todas as notificações
          </Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
