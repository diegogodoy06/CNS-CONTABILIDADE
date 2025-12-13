import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  InputBase,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Search,
  Notifications,
  Mail,
  Settings,
  Logout,
  Person,
  LightMode,
  Refresh,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';

const Header = () => {
  const { user } = useAppSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  // Mock de alertas críticos
  const alertasCriticos = [
    { id: 1, titulo: 'ISS vencendo hoje', cliente: 'Tech Solutions LTDA', tipo: 'critico' },
    { id: 2, titulo: '3 guias vencidas', cliente: 'Comércio ABC ME', tipo: 'critico' },
    { id: 3, titulo: 'Certificado expirando em 5 dias', cliente: 'Serviços XYZ', tipo: 'importante' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            width: 400,
          }}
        >
          <Search sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Buscar cliente, nota, documento..."
            sx={{ flex: 1, fontSize: '0.9rem' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            Ctrl+K
          </Typography>
        </Box>

        {/* Status / Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Status do sistema */}
          <Chip
            label="Sistema Online"
            size="small"
            color="success"
            variant="outlined"
            sx={{ mr: 2 }}
          />

          {/* Refresh */}
          <Tooltip title="Atualizar dados">
            <IconButton>
              <Refresh />
            </IconButton>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip title="Alternar tema">
            <IconButton>
              <LightMode />
            </IconButton>
          </Tooltip>

          {/* Messages */}
          <Tooltip title="Mensagens">
            <IconButton>
              <Badge badgeContent={3} color="info">
                <Mail />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Alertas">
            <IconButton onClick={handleNotificationsOpen}>
              <Badge badgeContent={alertasCriticos.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Profile */}
          <Box
            onClick={handleProfileMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              p: 0.5,
              borderRadius: 2,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <Avatar
              sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
            >
              {user?.nome?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user?.nome || 'Administrador'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.cargo || 'Contador'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { width: 220, mt: 1 }
          }}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
            Meu Perfil
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
            Configurações
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'error.main' }}>
            <ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
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
            sx: { width: 360, mt: 1, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Alertas Críticos
            </Typography>
          </Box>
          {alertasCriticos.map((alerta) => (
            <MenuItem key={alerta.id} onClick={handleNotificationsClose}>
              <Box sx={{ py: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: alerta.tipo === 'critico' ? 'error.main' : 'warning.main',
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {alerta.titulo}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {alerta.cliente}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleNotificationsClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              Ver todos os alertas
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
