import React, { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  useTheme,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Search,
  Menu as MenuIcon,
  Person,
  Settings,
  Logout,
  HelpOutline,
  KeyboardArrowDown,
  Business,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { setSidebarMobileOpen, toggleDarkMode } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '../shared/NotificationCenter';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

const Header: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user, company } = useAppSelector((state: RootState) => state.auth);
  const { sidebarMobileOpen, sidebarCollapsed, darkMode } = useAppSelector((state: RootState) => state.ui);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElCompany, setAnchorElCompany] = useState<null | HTMLElement>(null);

  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const handleDrawerToggle = () => {
    dispatch(setSidebarMobileOpen(!sidebarMobileOpen));
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenCompanyMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCompany(event.currentTarget);
  };

  const handleCloseCompanyMenu = () => {
    setAnchorElCompany(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate('/perfil');
  };

  const handleSettings = () => {
    handleCloseUserMenu();
    navigate('/configuracoes');
  };

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
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 1,
            display: { lg: 'none' },
            color: 'text.primary',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            width: { xs: '100%', sm: 400 },
            maxWidth: 400,
          }}
        >
          <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Buscar notas, documentos, tomadores..."
            sx={{
              flex: 1,
              fontSize: '0.9rem',
              color: 'text.primary',
              '& .MuiInputBase-input': {
                py: 0.75,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
            Ctrl+K
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Company Selector */}
        <Box
          onClick={handleOpenCompanyMenu}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            p: '6px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: alpha(theme.palette.common.black, 0.04),
            },
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: 'primary.main',
              fontSize: '0.75rem',
            }}
          >
            {company?.nomeFantasia?.substring(0, 2).toUpperCase() || 'EM'}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              maxWidth: 150,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {company?.nomeFantasia || 'Empresa Demo'}
          </Typography>
          <KeyboardArrowDown sx={{ fontSize: 18, color: 'text.secondary' }} />
        </Box>

        {/* Company Menu */}
        <Menu
          anchorEl={anchorElCompany}
          open={Boolean(anchorElCompany)}
          onClose={handleCloseCompanyMenu}
          disableRestoreFocus
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Empresa atual
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {company?.nomeFantasia || 'Empresa Demo'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {company?.cnpj || '00.000.000/0001-00'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleCloseCompanyMenu}>
            <ListItemIcon>
              <Business fontSize="small" />
            </ListItemIcon>
            Trocar empresa
          </MenuItem>
        </Menu>

        {/* Theme Toggle */}
        <Tooltip title={darkMode ? 'Modo claro' : 'Modo escuro'}>
          <IconButton
            onClick={handleToggleDarkMode}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {darkMode ? <LightMode sx={{ fontSize: 22 }} /> : <DarkMode sx={{ fontSize: 22 }} />}
          </IconButton>
        </Tooltip>

        {/* Help */}
        <Tooltip title="Central de Ajuda">
          <IconButton
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
            onClick={() => navigate('/ajuda')}
          >
            <HelpOutline sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <Box>
          <Tooltip title="Minha conta">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0.5,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'secondary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {user?.name?.substring(0, 2).toUpperCase() || 'US'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            disableRestoreFocus
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.name || 'Usuário'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'usuario@exemplo.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Meu Perfil
            </MenuItem>
            <MenuItem onClick={handleSettings}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
