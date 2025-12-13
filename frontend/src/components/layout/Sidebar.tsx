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
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  alpha,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  Description,
  Receipt,
  People,
  Assessment,
  Payment,
  Settings,
  CalendarMonth,
  AccountBalance,
  Help,
  ChevronLeft,
  ChevronRight,
  Drafts,
  Group,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { setSidebarMobileOpen, toggleSidebar } from '../../store/slices/uiSlice';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Início', icon: <Dashboard /> },
  { path: '/notas', label: 'Notas Fiscais', icon: <Receipt /> },
  { path: '/notas/rascunhos', label: 'Rascunhos', icon: <Drafts />, badge: 5 },
  { path: '/guias', label: 'Impostos', icon: <Payment />, badge: 3 }, // 3 guias pendentes
  { path: '/documentos', label: 'Documentos', icon: <Description /> },
  { path: '/tomadores', label: 'Tomadores', icon: <People /> },
  { path: '/calendario', label: 'Calendário', icon: <CalendarMonth /> },
  { path: '/relatorios', label: 'Relatórios', icon: <Assessment /> },
];

const bottomNavItems: NavItem[] = [
  { path: '/usuarios', label: 'Usuários', icon: <Group /> },
  { path: '/configuracoes', label: 'Configurações', icon: <Settings /> },
  { path: '/ajuda', label: 'Central de Ajuda', icon: <Help /> },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { sidebarMobileOpen, sidebarCollapsed } = useAppSelector((state: RootState) => state.ui);
  const { company } = useAppSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => {
    dispatch(setSidebarMobileOpen(!sidebarMobileOpen));
  };

  const handleToggleCollapse = () => {
    dispatch(toggleSidebar());
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const drawerWidth = sidebarCollapsed && !isMobile ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'space-between',
          px: sidebarCollapsed && !isMobile ? 1 : 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AccountBalance sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          {(!sidebarCollapsed || isMobile) && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '1.1rem',
                letterSpacing: '-0.5px',
                whiteSpace: 'nowrap',
              }}
            >
              CNS Contábil
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <IconButton
            onClick={handleToggleCollapse}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
            }}
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {/* Company Info */}
      {(!sidebarCollapsed || isMobile) && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {company?.nomeFantasia?.substring(0, 2).toUpperCase() || 'EM'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {company?.nomeFantasia || 'Empresa Demo'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
              >
                CNPJ: {company?.cnpj || '00.000.000/0001-00'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Collapsed Company Avatar */}
      {sidebarCollapsed && !isMobile && (
        <Box sx={{ py: 2, display: 'flex', justifyContent: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tooltip title={company?.nomeFantasia || 'Empresa Demo'} placement="right">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {company?.nomeFantasia?.substring(0, 2).toUpperCase() || 'EM'}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      {/* Main Navigation */}
      <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
        <List sx={{ px: sidebarCollapsed && !isMobile ? 0.5 : 1 }}>
          {mainNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={sidebarCollapsed && !isMobile ? item.label : ''} placement="right">
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={isMobile ? handleDrawerToggle : undefined}
                    sx={{
                      borderRadius: '8px',
                      py: 1.25,
                      px: sidebarCollapsed && !isMobile ? 1.5 : 1.5,
                      minHeight: 48,
                      justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                      color: active ? 'white' : 'text.secondary',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: active ? 'primary.dark' : 'action.hover',
                        color: active ? 'white' : 'primary.main',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: active ? 'white' : 'text.secondary',
                        minWidth: sidebarCollapsed && !isMobile ? 0 : 36,
                        justifyContent: 'center',
                        '& svg': { fontSize: 22 },
                      }}
                    >
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="warning" max={99}>
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    {(!sidebarCollapsed || isMobile) && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: active ? 600 : 500,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Navigation */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 2 }}>
        <List sx={{ px: sidebarCollapsed && !isMobile ? 0.5 : 1 }}>
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={sidebarCollapsed && !isMobile ? item.label : ''} placement="right">
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={isMobile ? handleDrawerToggle : undefined}
                    sx={{
                      borderRadius: '8px',
                      py: 1,
                      px: sidebarCollapsed && !isMobile ? 1.5 : 1.5,
                      minHeight: 44,
                      justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                      color: active ? 'white' : 'text.secondary',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: active ? 'primary.dark' : 'action.hover',
                        color: active ? 'white' : 'primary.main',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: active ? 'white' : 'text.secondary',
                        minWidth: sidebarCollapsed && !isMobile ? 0 : 36,
                        justifyContent: 'center',
                        '& svg': { fontSize: 20 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {(!sidebarCollapsed || isMobile) && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: active ? 600 : 500,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
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
