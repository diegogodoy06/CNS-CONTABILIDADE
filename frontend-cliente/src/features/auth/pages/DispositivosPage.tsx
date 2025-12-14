import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Tooltip,
  alpha,
  useTheme,
  Grid,
} from '@mui/material';
import {
  Laptop,
  PhoneAndroid,
  Tablet,
  Computer,
  Delete,
  Security,
  LocationOn,
  AccessTime,
  CheckCircle,
  Warning,
  Logout,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Dispositivo {
  id: string;
  tipo: 'desktop' | 'mobile' | 'tablet';
  nome: string;
  navegador: string;
  sistemaOperacional: string;
  ip: string;
  localizacao: string;
  ultimoAcesso: string;
  sessaoAtual: boolean;
}

// Mock de dispositivos conectados
const mockDispositivos: Dispositivo[] = [
  {
    id: '1',
    tipo: 'desktop',
    nome: 'Windows PC',
    navegador: 'Chrome 120.0',
    sistemaOperacional: 'Windows 11',
    ip: '187.45.123.89',
    localizacao: 'São Paulo, SP',
    ultimoAcesso: new Date().toISOString(),
    sessaoAtual: true,
  },
  {
    id: '2',
    tipo: 'mobile',
    nome: 'iPhone 15',
    navegador: 'Safari 17.2',
    sistemaOperacional: 'iOS 17.2',
    ip: '189.67.234.12',
    localizacao: 'São Paulo, SP',
    ultimoAcesso: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sessaoAtual: false,
  },
  {
    id: '3',
    tipo: 'tablet',
    nome: 'iPad Pro',
    navegador: 'Safari 17.0',
    sistemaOperacional: 'iPadOS 17.2',
    ip: '187.45.123.90',
    localizacao: 'Campinas, SP',
    ultimoAcesso: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    sessaoAtual: false,
  },
  {
    id: '4',
    tipo: 'desktop',
    nome: 'MacBook Pro',
    navegador: 'Chrome 119.0',
    sistemaOperacional: 'macOS Sonoma',
    ip: '200.134.56.78',
    localizacao: 'Rio de Janeiro, RJ',
    ultimoAcesso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    sessaoAtual: false,
  },
];

const getDeviceIcon = (tipo: Dispositivo['tipo']) => {
  switch (tipo) {
    case 'mobile':
      return <PhoneAndroid />;
    case 'tablet':
      return <Tablet />;
    default:
      return <Laptop />;
  }
};

const DispositivosPage: React.FC = () => {
  const theme = useTheme();
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>(mockDispositivos);
  const [selectedDevice, setSelectedDevice] = useState<Dispositivo | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [revokeAllDialogOpen, setRevokeAllDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRevokeSession = async (device: Dispositivo) => {
    setSelectedDevice(device);
    setConfirmDialogOpen(true);
  };

  const confirmRevoke = async () => {
    if (!selectedDevice) return;
    
    setLoading(true);
    // Simula chamada à API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setDispositivos(prev => prev.filter(d => d.id !== selectedDevice.id));
    setConfirmDialogOpen(false);
    setSelectedDevice(null);
    setLoading(false);
  };

  const handleRevokeAll = async () => {
    setRevokeAllDialogOpen(true);
  };

  const confirmRevokeAll = async () => {
    setLoading(true);
    // Simula chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mantém apenas a sessão atual
    setDispositivos(prev => prev.filter(d => d.sessaoAtual));
    setRevokeAllDialogOpen(false);
    setLoading(false);
  };

  const outroDispositivos = dispositivos.filter(d => !d.sessaoAtual);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dispositivos Conectados
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie os dispositivos que têm acesso à sua conta
        </Typography>
      </Box>

      {/* Sessão Atual */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Security color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Sessão Atual
            </Typography>
            <Chip label="Ativa" color="success" size="small" />
          </Box>

          {dispositivos.filter(d => d.sessaoAtual).map(device => (
            <Box
              key={device.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.08),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {getDeviceIcon(device.tipo)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {device.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {device.navegador} • {device.sistemaOperacional}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {device.localizacao}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Ativo agora
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Chip
                icon={<CheckCircle />}
                label="Este dispositivo"
                color="success"
                variant="outlined"
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Outros Dispositivos */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Computer color="action" />
              <Typography variant="h6" fontWeight={600}>
                Outros Dispositivos
              </Typography>
              <Chip label={outroDispositivos.length} size="small" />
            </Box>
            {outroDispositivos.length > 0 && (
              <Button
                color="error"
                startIcon={<Logout />}
                onClick={handleRevokeAll}
                size="small"
              >
                Encerrar todas
              </Button>
            )}
          </Box>

          {outroDispositivos.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Não há outros dispositivos conectados à sua conta.
            </Alert>
          ) : (
            <List disablePadding>
              {outroDispositivos.map((device, index) => {
                const isOld = new Date(device.ultimoAcesso) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <React.Fragment key={device.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        py: 2,
                        px: 0,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: isOld 
                              ? alpha(theme.palette.warning.main, 0.1)
                              : alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isOld ? 'warning.main' : 'primary.main',
                          }}
                        >
                          {getDeviceIcon(device.tipo)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {device.nome}
                            </Typography>
                            {isOld && (
                              <Tooltip title="Sessão inativa há mais de 7 dias">
                                <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                              </Tooltip>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box component="span">
                            <Typography component="span" variant="body2" color="text.secondary">
                              {device.navegador} • {device.sistemaOperacional}
                            </Typography>
                            <br />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {device.localizacao}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {formatDistanceToNow(parseISO(device.ultimoAcesso), { 
                                    addSuffix: true,
                                    locale: ptBR 
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Encerrar sessão">
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleRevokeSession(device)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Dicas de Segurança */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            💡 Dicas de Segurança
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Encerre sessões de dispositivos que você não reconhece
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Revogue acessos de dispositivos perdidos ou roubados
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Mantenha seu navegador e sistema operacional atualizados
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Ative a autenticação em duas etapas (2FA)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação - Revogar Uma */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Encerrar sessão?</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja encerrar a sessão do dispositivo{' '}
            <strong>{selectedDevice?.nome}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            O usuário precisará fazer login novamente neste dispositivo.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmRevoke}
            disabled={loading}
          >
            {loading ? 'Encerrando...' : 'Encerrar Sessão'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação - Revogar Todas */}
      <Dialog open={revokeAllDialogOpen} onClose={() => setRevokeAllDialogOpen(false)}>
        <DialogTitle>Encerrar todas as sessões?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta ação encerrará {outroDispositivos.length} sessão(ões) ativa(s).
          </Alert>
          <Typography>
            Todos os dispositivos, exceto o atual, serão desconectados. Os usuários
            precisarão fazer login novamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeAllDialogOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmRevokeAll}
            disabled={loading}
          >
            {loading ? 'Encerrando...' : 'Encerrar Todas'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DispositivosPage;
