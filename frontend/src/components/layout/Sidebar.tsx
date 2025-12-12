import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Description,
  Receipt,
  People,
  Assessment,
  Payment,
  Settings,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { toggleSidebar, setSidebarMobileOpen } from '../../store/slices/uiSlice';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/notas', label: 'Notas Fiscais', icon: <Receipt /> },
  { path: '/guias', label: 'Guias e Impostos', icon: <Payment /> },
  { path: '/documentos', label: 'Documentos', icon: <Description /> },
  { path: '/tomadores', label: 'Tomadores', icon: <People /> },
  { path: '/relatorios', label: 'Relatórios', icon: <Assessment /> },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { sidebarCollapsed, sidebarMobileOpen } = useAppSelector((state: RootState) => state.ui);
  const { user, company } = useAppSelector((state: RootState) => state.auth);

  const drawerWidth = sidebarCollapsed && !isMobile ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const handleDrawerToggle = () => {
    if (isMobile) {
      dispatch(setSidebarMobileOpen(!sidebarMobileOpen));
    } else {
      dispatch(toggleSidebar());
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'secondary.main',
        color: 'grey.300',
      }}
    >
      {/* Header / Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: sidebarCollapsed && !isMobile ? 1.5 : 3,
          bgcolor: 'secondary.dark',
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              C
            </Typography>
          </Box>
          {(!sidebarCollapsed || isMobile) && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                CNS <Typography component="span" sx={{ color: 'grey.400', fontWeight: 'normal' }}>Contábil</Typography>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* User Profile */}
      <Box
        sx={{
          p: sidebarCollapsed && !isMobile ? 1.5 : 2,
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,0.08)',
          bgcolor: 'rgba(255,255,255,0.02)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'grey.700',
              fontSize: '0.875rem',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
          </Avatar>
          {(!sidebarCollapsed || isMobile) && (
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: 'white', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {user?.name || 'Usuário'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'grey.500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
              >
                {company?.nomeFantasia || company?.razaoSocial || 'Empresa'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        {(!sidebarCollapsed || isMobile) && (
          <Typography
            variant="overline"
            sx={{ px: 3, mb: 1, display: 'block', color: 'grey.500', fontSize: '0.625rem' }}
          >
            Menu Principal
          </Typography>
        )}
        <List sx={{ px: 1 }}>
          {mainNavItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={sidebarCollapsed && !isMobile ? item.label : ''} placement="right">
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={() => isMobile && dispatch(setSidebarMobileOpen(false))}
                  sx={{
                    minHeight: 44,
                    borderRadius: 1,
                    px: sidebarCollapsed && !isMobile ? 1.5 : 2,
                    justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                    borderLeft: '3px solid',
                    borderColor: isActive(item.path) ? 'primary.main' : 'transparent',
                    bgcolor: isActive(item.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive(item.path) ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: sidebarCollapsed && !isMobile ? 0 : 40,
                      color: isActive(item.path) ? 'primary.light' : 'grey.500',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(!sidebarCollapsed || isMobile) && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive(item.path) ? 500 : 400,
                        color: isActive(item.path) ? 'white' : 'grey.400',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.08)' }}>
        <List sx={{ px: 1, py: 1 }}>
          <ListItem disablePadding>
            <Tooltip title={sidebarCollapsed && !isMobile ? 'Configurações' : ''} placement="right">
              <ListItemButton
                component={NavLink}
                to="/configuracoes"
                sx={{
                  minHeight: 44,
                  borderRadius: 1,
                  px: sidebarCollapsed && !isMobile ? 1.5 : 2,
                  justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: sidebarCollapsed && !isMobile ? 0 : 40,
                    color: 'grey.500',
                    justifyContent: 'center',
                  }}
                >
                  <Settings />
                </ListItemIcon>
                {(!sidebarCollapsed || isMobile) && (
                  <ListItemText
                    primary="Configurações"
                    primaryTypographyProps={{ fontSize: '0.875rem', color: 'grey.400' }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* Collapse Toggle - Desktop Only */}
        {!isMobile && (
          <Box
            sx={{
              p: 1.5,
              borderTop: '1px solid',
              borderColor: 'rgba(255,255,255,0.08)',
              bgcolor: 'secondary.dark',
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                width: '100%',
                borderRadius: 1,
                color: 'grey.400',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={sidebarMobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
