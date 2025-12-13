import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  Badge,
  Avatar,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  Business,
  Description,
  Receipt,
  Mail,
  BarChart,
  Settings,
  ExpandLess,
  ExpandMore,
  Warning,
  Notifications,
  SupportAgent,
  Campaign,
  People,
  ChevronLeft,
  ChevronRight,
  Gavel,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 72;

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
  badgeColor?: 'error' | 'warning' | 'info' | 'success';
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
  },
  {
    label: 'Clientes',
    icon: <Business />,
    path: '/clientes',
    badge: 3,
    badgeColor: 'warning',
  },
  {
    label: 'Monitoramento',
    icon: <Notifications />,
    children: [
      { label: 'Alertas', icon: <Warning />, path: '/alertas', badge: 8, badgeColor: 'error' },
      { label: 'Guias Vencendo', icon: <Gavel />, path: '/guias-vencendo', badge: 12, badgeColor: 'warning' },
      { label: 'Tickets', icon: <SupportAgent />, path: '/tickets', badge: 5, badgeColor: 'info' },
    ],
  },
  {
    label: 'Notas Fiscais',
    icon: <Receipt />,
    path: '/notas',
  },
  {
    label: 'Documentos',
    icon: <Description />,
    path: '/documentos',
  },
  {
    label: 'Comunicação',
    icon: <Mail />,
    children: [
      { label: 'Comunicados', icon: <Campaign />, path: '/comunicados' },
      { label: 'Mensagens', icon: <Mail />, path: '/mensagens', badge: 3, badgeColor: 'info' },
    ],
  },
  {
    label: 'Relatórios',
    icon: <BarChart />,
    path: '/relatorios',
  },
  {
    label: 'Equipe',
    icon: <People />,
    path: '/equipe',
  },
  {
    label: 'Configurações',
    icon: <Settings />,
    path: '/configuracoes',
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector(state => state.ui);
  const [openMenus, setOpenMenus] = useState<string[]>(['Monitoramento']);

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setOpenMenus(prev =>
        prev.includes(item.label)
          ? prev.filter(l => l !== item.label)
          : [...prev, item.label]
      );
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => child.path && location.pathname === child.path);
  };

  const renderBadge = (badge?: number, color?: 'error' | 'warning' | 'info' | 'success') => {
    if (!badge) return null;
    return (
      <Badge
        badgeContent={badge}
        color={color || 'primary'}
        sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 18, minWidth: 18 } }}
      />
    );
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const active = isActive(item.path) || isParentActive(item.children);
    const hasChildren = !!item.children;
    const isOpen = openMenus.includes(item.label);

    const button = (
      <ListItemButton
        onClick={() => handleMenuClick(item)}
        sx={{
          minHeight: 48,
          px: sidebarCollapsed && !isChild ? 2.5 : 2,
          pl: isChild ? 4 : 2,
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          bgcolor: active ? 'primary.main' : 'transparent',
          color: active ? 'white' : 'text.primary',
          '&:hover': {
            bgcolor: active ? 'primary.dark' : 'action.hover',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: sidebarCollapsed && !isChild ? 'auto' : 40,
            mr: sidebarCollapsed && !isChild ? 0 : 2,
            color: active ? 'white' : 'text.secondary',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {(!sidebarCollapsed || isChild) && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: active ? 600 : 500,
              }}
            />
            {renderBadge(item.badge, item.badgeColor)}
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </>
        )}
      </ListItemButton>
    );

    if (sidebarCollapsed && !isChild) {
      return (
        <Tooltip title={item.label} placement="right" key={item.label}>
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              CNS
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                CNS Contábil
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Portal Admin
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => dispatch(toggleSidebarCollapsed())}
          sx={{ bgcolor: 'grey.100' }}
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <Box key={item.label}>
              <ListItem disablePadding>
                {renderMenuItem(item)}
              </ListItem>
              {item.children && !sidebarCollapsed && (
                <Collapse in={openMenus.includes(item.label)} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.label} disablePadding>
                        {renderMenuItem(child, true)}
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Footer - Stats */}
      {!sidebarCollapsed && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.main',
                borderRadius: 2,
                color: 'white',
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Clientes Ativos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                47
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                de 52 empresas
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default Sidebar;
