import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  Alert,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  LinearProgress,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Security,
  Palette,
  Save,
  Edit,
  PhotoCamera,
  LightMode,
  DarkMode,
  Language,
  Phone,
  Email,
  Key,
  Visibility,
  VisibilityOff,
  Smartphone,
  Computer,
  Tablet,
  History,
  Shield,
  Check,
  Warning,
  Notifications,
  CalendarMonth,
  Logout,
  QrCode2,
  ContentCopy,
  Verified,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store';
import { toggleDarkMode } from '../../../store/slices/uiSlice';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import configuracoesService from '../../../services/configuracoesService';
import { useAppSelector } from '../../../store/hooks';

// Tipos
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Dispositivo {
  id: string;
  tipo: 'desktop' | 'mobile' | 'tablet';
  navegador: string;
  sistema: string;
  ip: string;
  localizacao: string;
  ultimoAcesso: string;
  atual: boolean;
}

interface AtividadeRecente {
  id: string;
  acao: string;
  descricao: string;
  ip: string;
  data: string;
  sucesso: boolean;
}

// Tab Panel Component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const PerfilPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const { user } = useAppSelector((state: RootState) => state.auth);

  // Estados para dados da API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);

  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [usuario, setUsuario] = useState({
    id: user?.id || '',
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: '',
    cargo: user?.role || '',
    avatar: null as string | null,
    dataCadastro: user?.createdAt || '',
    ultimoAcesso: '',
    twoFactorEnabled: false,
    emailVerificado: true,
  });

  // Estados para dialogs
  const [alterarSenhaOpen, setAlterarSenhaOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [desconectarDispositivo, setDesconectarDispositivo] = useState<Dispositivo | null>(null);

  // Estados do formulário de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Carregar dados do perfil
  const fetchPerfil = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const perfilRes = await configuracoesService.getPerfil();
      
      if (perfilRes) {
        setUsuario({
          id: perfilRes.id || user?.id || '',
          nome: perfilRes.nome || user?.nome || '',
          email: perfilRes.email || user?.email || '',
          telefone: perfilRes.telefone || '',
          cargo: perfilRes.tipo || perfilRes.role || perfilRes.cargo || 'Cliente',
          avatar: perfilRes.avatarUrl || perfilRes.avatar || null,
          dataCadastro: perfilRes.criadoEm || perfilRes.createdAt || '',
          ultimoAcesso: perfilRes.ultimoAcesso || '',
          twoFactorEnabled: perfilRes.twoFactorEnabled || false,
          emailVerificado: perfilRes.emailVerificado ?? true,
        });
        
        // Se vier dispositivos e atividades
        if (perfilRes.dispositivos) {
          setDispositivos(perfilRes.dispositivos);
        }
        if (perfilRes.atividades) {
          setAtividades(perfilRes.atividades);
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      // Usar dados do Redux se a API falhar
      setUsuario(prev => ({
        ...prev,
        id: user?.id || prev.id,
        nome: user?.nome || prev.nome,
        email: user?.email || prev.email,
        cargo: user?.role || prev.cargo || 'Cliente',
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.nome, user?.email, user?.role]);

  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  // Preferências do usuário
  const [preferencias, setPreferencias] = useState({
    idioma: 'pt-BR',
    formatoData: 'DD/MM/YYYY',
    notificacoesEmail: true,
    notificacoesPush: true,
    resumoDiario: false,
  });

  const handleSave = async () => {
    try {
      await configuracoesService.updatePerfil({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
      });
      setShowSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      setError(err.response?.data?.message || 'Erro ao salvar perfil');
    }
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleAlterarSenha = async () => {
    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) return;
    if (novaSenha !== confirmarSenha) return;
    if (novaSenha.length < 8) return;

    try {
      await configuracoesService.alterarSenha({
        senhaAtual,
        novaSenha,
        confirmarSenha,
      });
      setAlterarSenhaOpen(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      setError(err.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  const handleDesconectarDispositivo = () => {
    if (!desconectarDispositivo) return;
    // Simular desconexão
    setDesconectarDispositivo(null);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const getDeviceIcon = (tipo: string) => {
    switch (tipo) {
      case 'desktop':
        return <Computer />;
      case 'mobile':
        return <Smartphone />;
      case 'tablet':
        return <Tablet />;
      default:
        return <Computer />;
    }
  };

  const calcularForcaSenha = (senha: string): number => {
    let forca = 0;
    if (senha.length >= 8) forca += 25;
    if (senha.length >= 12) forca += 15;
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) forca += 20;
    if (/\d/.test(senha)) forca += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) forca += 20;
    return Math.min(forca, 100);
  };

  const forcaSenha = calcularForcaSenha(novaSenha);
  const corForcaSenha = forcaSenha < 40 ? 'error' : forcaSenha < 70 ? 'warning' : 'success';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
          Meu Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie suas informações pessoais, segurança e preferências.
        </Typography>
      </Box>

      {showSaveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSaveSuccess(false)}>
          Alterações salvas com sucesso!
        </Alert>
      )}

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              }
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: 40,
                }}
              >
                {usuario.nome.charAt(0)}
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" fontWeight={600}>
                  {usuario.nome}
                </Typography>
                {usuario.emailVerificado && (
                  <Tooltip title="E-mail verificado">
                    <Verified color="primary" fontSize="small" />
                  </Tooltip>
                )}
              </Box>
              <Typography variant="body1" color="text.secondary">
                {usuario.email}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Chip label={usuario.cargo || 'Cliente'} size="small" color="primary" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  Membro desde {usuario.dataCadastro ? format(parseISO(usuario.dataCadastro), "MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
            },
          }}
        >
          <Tab icon={<Person />} label="Dados Pessoais" iconPosition="start" />
          <Tab icon={<Security />} label="Segurança" iconPosition="start" />
          <Tab icon={<Palette />} label="Preferências" iconPosition="start" />
          <Tab icon={<History />} label="Atividade Recente" iconPosition="start" />
        </Tabs>
      </Card>

      {/* Tab 0: Dados Pessoais */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Informações Pessoais
                  </Typography>
                  <Button
                    variant={editMode ? 'contained' : 'outlined'}
                    startIcon={editMode ? <Save /> : <Edit />}
                    onClick={editMode ? handleSave : () => setEditMode(true)}
                  >
                    {editMode ? 'Salvar' : 'Editar'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      value={usuario.nome}
                      onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="E-mail"
                      value={usuario.email}
                      onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: usuario.emailVerificado && (
                          <InputAdornment position="end">
                            <Tooltip title="E-mail verificado">
                              <Verified color="success" fontSize="small" />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={usuario.telefone}
                      onChange={(e) => setUsuario({ ...usuario, telefone: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cargo"
                      value={usuario.cargo}
                      disabled
                      helperText="O cargo é definido pelo administrador"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Resumo da Conta
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Último acesso"
                      secondary={formatDistanceToNow(parseISO(usuario.ultimoAcesso), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Dispositivos ativos"
                      secondary={`${dispositivos.length} dispositivo(s)`}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Autenticação 2FA"
                      secondary={
                        <Chip
                          label={usuario.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                          size="small"
                          color={usuario.twoFactorEnabled ? 'success' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 1: Segurança */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  <Key sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Senha
                </Typography>

                <Alert severity="info" sx={{ mb: 2 }}>
                  Última alteração de senha há 30 dias
                </Alert>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Sua senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<Key />}
                  onClick={() => setAlterarSenhaOpen(true)}
                  fullWidth
                >
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  <Shield sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Autenticação em Dois Fatores (2FA)
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(
                      usuario.twoFactorEnabled ? theme.palette.success.main : theme.palette.warning.main,
                      0.1
                    ),
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {usuario.twoFactorEnabled ? (
                      <Check color="success" />
                    ) : (
                      <Warning color="warning" />
                    )}
                    <Typography variant="subtitle1" fontWeight={600}>
                      {usuario.twoFactorEnabled ? '2FA Ativado' : '2FA Desativado'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {usuario.twoFactorEnabled
                      ? 'Sua conta está protegida com autenticação em dois fatores.'
                      : 'Adicione uma camada extra de segurança à sua conta.'}
                  </Typography>
                </Box>

                <Button
                  variant={usuario.twoFactorEnabled ? 'outlined' : 'contained'}
                  color={usuario.twoFactorEnabled ? 'error' : 'primary'}
                  startIcon={<QrCode2 />}
                  onClick={() => setTwoFactorOpen(true)}
                  fullWidth
                >
                  {usuario.twoFactorEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    <Computer sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Dispositivos Conectados
                  </Typography>
                  <Chip label={`${dispositivos.length} ativos`} size="small" />
                </Box>

                <List>
                  {dispositivos.map((dispositivo, index) => (
                    <React.Fragment key={dispositivo.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        sx={{
                          bgcolor: dispositivo.atual ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                          borderRadius: 1,
                        }}
                      >
                        <ListItemIcon>{getDeviceIcon(dispositivo.tipo)}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {dispositivo.navegador} - {dispositivo.sistema}
                              {dispositivo.atual && (
                                <Chip label="Este dispositivo" size="small" color="primary" />
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              {dispositivo.localizacao} • {dispositivo.ip}
                              <br />
                              Último acesso:{' '}
                              {formatDistanceToNow(parseISO(dispositivo.ultimoAcesso), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </>
                          }
                        />
                        {!dispositivo.atual && (
                          <ListItemSecondaryAction>
                            <Tooltip title="Desconectar dispositivo">
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => setDesconectarDispositivo(dispositivo)}
                              >
                                <Logout />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ mt: 2 }}
                  startIcon={<Logout />}
                >
                  Desconectar todos os outros dispositivos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 2: Preferências */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Aparência
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>{darkMode ? <DarkMode /> : <LightMode />}</ListItemIcon>
                    <ListItemText
                      primary="Tema Escuro"
                      secondary="Ativar modo noturno para reduzir cansaço visual"
                    />
                    <ListItemSecondaryAction>
                      <Switch edge="end" checked={darkMode} onChange={handleToggleDarkMode} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText primary="Idioma" secondary="Idioma da interface" />
                    <ListItemSecondaryAction>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={preferencias.idioma}
                          onChange={(e) =>
                            setPreferencias({ ...preferencias, idioma: e.target.value })
                          }
                        >
                          <MenuItem value="pt-BR">Português (BR)</MenuItem>
                          <MenuItem value="en-US">English (US)</MenuItem>
                          <MenuItem value="es">Español</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Formato de Data
                </Typography>

                <FormControl fullWidth size="small">
                  <InputLabel>Formato de Data</InputLabel>
                  <Select
                    value={preferencias.formatoData}
                    label="Formato de Data"
                    onChange={(e) =>
                      setPreferencias({ ...preferencias, formatoData: e.target.value })
                    }
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Notificações
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificações por E-mail"
                      secondary="Receber alertas importantes por e-mail"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={preferencias.notificacoesEmail}
                        onChange={(e) =>
                          setPreferencias({
                            ...preferencias,
                            notificacoesEmail: e.target.checked,
                          })
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificações Push"
                      secondary="Receber notificações no navegador"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={preferencias.notificacoesPush}
                        onChange={(e) =>
                          setPreferencias({
                            ...preferencias,
                            notificacoesPush: e.target.checked,
                          })
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <CalendarMonth />
                    </ListItemIcon>
                    <ListItemText
                      primary="Resumo Diário"
                      secondary="Receber resumo das atividades diariamente"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={preferencias.resumoDiario}
                        onChange={(e) =>
                          setPreferencias({
                            ...preferencias,
                            resumoDiario: e.target.checked,
                          })
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Button
                  variant="text"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/configuracoes/notificacoes')}
                >
                  Configurações avançadas de notificações →
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
            Salvar Preferências
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 3: Atividade Recente */}
      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Histórico de Atividades
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ação</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>IP</TableCell>
                    <TableCell>Data/Hora</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {atividades.map((atividade) => (
                    <TableRow key={atividade.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {atividade.acao}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {atividade.descricao}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {atividade.ip}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(parseISO(atividade.data), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {atividade.sucesso ? (
                          <Chip label="Sucesso" size="small" color="success" />
                        ) : (
                          <Chip label="Falha" size="small" color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button variant="text">Carregar mais atividades</Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Dialog: Alterar Senha */}
      <Dialog open={alterarSenhaOpen} onClose={() => setAlterarSenhaOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Senha Atual"
              type={showSenhaAtual ? 'text' : 'password'}
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowSenhaAtual(!showSenhaAtual)} edge="end">
                      {showSenhaAtual ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Nova Senha"
              type={showNovaSenha ? 'text' : 'password'}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNovaSenha(!showNovaSenha)} edge="end">
                      {showNovaSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {novaSenha && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Força da senha
                  </Typography>
                  <Typography variant="body2" color={`${corForcaSenha}.main`}>
                    {forcaSenha < 40 ? 'Fraca' : forcaSenha < 70 ? 'Média' : 'Forte'}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={forcaSenha}
                  color={corForcaSenha}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}
            <TextField
              fullWidth
              label="Confirmar Nova Senha"
              type={showConfirmarSenha ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              error={confirmarSenha !== '' && confirmarSenha !== novaSenha}
              helperText={
                confirmarSenha !== '' && confirmarSenha !== novaSenha
                  ? 'As senhas não coincidem'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmarSenha(!showConfirmarSenha)} edge="end">
                      {showConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlterarSenhaOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAlterarSenha}
            disabled={
              !senhaAtual ||
              !novaSenha ||
              !confirmarSenha ||
              novaSenha !== confirmarSenha ||
              novaSenha.length < 8
            }
          >
            Alterar Senha
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Ativar 2FA */}
      <Dialog open={twoFactorOpen} onClose={() => setTwoFactorOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {usuario.twoFactorEnabled ? 'Desativar 2FA' : 'Ativar Autenticação em Dois Fatores'}
        </DialogTitle>
        <DialogContent>
          {usuario.twoFactorEnabled ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Desativar a autenticação em dois fatores reduzirá a segurança da sua conta. Tem certeza
              que deseja continuar?
            </Alert>
          ) : (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Escaneie o QR Code abaixo com um aplicativo autenticador (Google Authenticator,
                Authy, etc.)
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3,
                  p: 3,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                  }}
                >
                  <QrCode2 sx={{ fontSize: 150, color: 'grey.400' }} />
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Ou insira manualmente o código:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'monospace',
                }}
              >
                <Typography variant="body1" fontFamily="monospace">
                  ABCD EFGH IJKL MNOP
                </Typography>
                <IconButton size="small">
                  <ContentCopy />
                </IconButton>
              </Paper>

              <TextField
                fullWidth
                label="Código de Verificação"
                placeholder="000000"
                sx={{ mt: 3 }}
                inputProps={{ maxLength: 6 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTwoFactorOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color={usuario.twoFactorEnabled ? 'error' : 'primary'}
            onClick={() => {
              setUsuario({ ...usuario, twoFactorEnabled: !usuario.twoFactorEnabled });
              setTwoFactorOpen(false);
              setShowSaveSuccess(true);
              setTimeout(() => setShowSaveSuccess(false), 3000);
            }}
          >
            {usuario.twoFactorEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Desconectar Dispositivo */}
      <Dialog
        open={!!desconectarDispositivo}
        onClose={() => setDesconectarDispositivo(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Desconectar Dispositivo</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja desconectar o dispositivo{' '}
            <strong>
              {desconectarDispositivo?.navegador} - {desconectarDispositivo?.sistema}
            </strong>
            ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            O usuário precisará fazer login novamente neste dispositivo.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDesconectarDispositivo(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDesconectarDispositivo}>
            Desconectar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PerfilPage;
