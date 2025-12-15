import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  FormControlLabel,
  Switch,
  Alert,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Block,
  CheckCircle,
  PersonAdd,
  PersonOff,
  VpnKey,
  LockReset,
  Security,
  AdminPanelSettings,
  Person,
  History,
  Send,
  Close,
  Delete,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data de colaboradores
const mockColaboradores = [
  {
    id: '1',
    nome: 'João Administrador',
    email: 'joao@cnscontabilidade.com.br',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-0001',
    perfil: 'administrador' as const,
    status: 'ativo' as const,
    dataCadastro: '2020-01-15',
    ultimoAcesso: '2025-12-13T10:30:00',
    clientesAtribuidos: 52,
    ticketsResolvidos: 234,
    twoFactorEnabled: true,
  },
  {
    id: '2',
    nome: 'Carlos Contador',
    email: 'carlos@cnscontabilidade.com.br',
    cpf: '987.654.321-00',
    telefone: '(11) 99999-0002',
    perfil: 'contador' as const,
    status: 'ativo' as const,
    dataCadastro: '2021-03-20',
    ultimoAcesso: '2025-12-13T09:15:00',
    clientesAtribuidos: 28,
    ticketsResolvidos: 156,
    twoFactorEnabled: true,
  },
  {
    id: '3',
    nome: 'Ana Assistente',
    email: 'ana@cnscontabilidade.com.br',
    cpf: '456.789.123-00',
    telefone: '(11) 99999-0003',
    perfil: 'assistente' as const,
    status: 'ativo' as const,
    dataCadastro: '2022-06-10',
    ultimoAcesso: '2025-12-12T17:45:00',
    clientesAtribuidos: 24,
    ticketsResolvidos: 89,
    twoFactorEnabled: false,
  },
  {
    id: '4',
    nome: 'Maria Visualizadora',
    email: 'maria@cnscontabilidade.com.br',
    cpf: '789.123.456-00',
    telefone: '(11) 99999-0004',
    perfil: 'visualizador' as const,
    status: 'ativo' as const,
    dataCadastro: '2023-01-05',
    ultimoAcesso: '2025-12-11T14:20:00',
    clientesAtribuidos: 0,
    ticketsResolvidos: 0,
    twoFactorEnabled: false,
  },
  {
    id: '5',
    nome: 'Pedro Assistente',
    email: 'pedro@cnscontabilidade.com.br',
    cpf: '321.654.987-00',
    telefone: '(11) 99999-0005',
    perfil: 'assistente' as const,
    status: 'inativo' as const,
    dataCadastro: '2022-09-15',
    ultimoAcesso: '2025-10-20T11:00:00',
    clientesAtribuidos: 0,
    ticketsResolvidos: 45,
    twoFactorEnabled: false,
  },
];

const permissoesDisponiveis = [
  { id: 'dashboard', nome: 'Dashboard', descricao: 'Acesso ao dashboard completo' },
  { id: 'clientes', nome: 'Gestão de Clientes', descricao: 'Cadastrar, editar e visualizar clientes' },
  { id: 'usuarios', nome: 'Gestão de Usuários', descricao: 'Gerenciar usuários dos clientes' },
  { id: 'notas', nome: 'Notas Fiscais', descricao: 'Visualizar e emitir notas fiscais' },
  { id: 'guias', nome: 'Guias e Documentos', descricao: 'Upload e gestão de guias' },
  { id: 'tickets', nome: 'Tickets de Suporte', descricao: 'Responder e gerenciar tickets' },
  { id: 'comunicados', nome: 'Comunicados', descricao: 'Enviar comunicados em massa' },
  { id: 'relatorios', nome: 'Relatórios', descricao: 'Gerar e exportar relatórios' },
  { id: 'configuracoes', nome: 'Configurações', descricao: 'Alterar configurações do sistema' },
  { id: 'auditoria', nome: 'Auditoria', descricao: 'Visualizar logs de auditoria' },
];

const permissoesPorPerfil = {
  administrador: permissoesDisponiveis.map(p => p.id),
  contador: ['dashboard', 'clientes', 'usuarios', 'notas', 'guias', 'tickets', 'comunicados', 'relatorios'],
  assistente: ['dashboard', 'guias', 'tickets'],
  visualizador: ['dashboard', 'relatorios'],
};

const EquipePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedColaborador, setSelectedColaborador] = useState<typeof mockColaboradores[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    perfil: 'assistente' as 'administrador' | 'contador' | 'assistente' | 'visualizador',
    permissoesCustomizadas: [] as string[],
  });

  const tabs = [
    { label: 'Todos', count: mockColaboradores.length },
    { label: 'Ativos', count: mockColaboradores.filter(c => c.status === 'ativo').length },
    { label: 'Inativos', count: mockColaboradores.filter(c => c.status === 'inativo').length },
  ];

  const filteredColaboradores = mockColaboradores.filter(colaborador => {
    const matchesSearch =
      colaborador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.cpf.includes(searchTerm);

    let matchesTab = true;
    if (activeTab === 1) matchesTab = colaborador.status === 'ativo';
    if (activeTab === 2) matchesTab = colaborador.status === 'inativo';

    return matchesSearch && matchesTab;
  });

  const getPerfilConfig = (perfil: string) => {
    switch (perfil) {
      case 'administrador':
        return { color: 'error' as const, icon: <AdminPanelSettings fontSize="small" />, label: 'Administrador' };
      case 'contador':
        return { color: 'primary' as const, icon: <Security fontSize="small" />, label: 'Contador' };
      case 'assistente':
        return { color: 'info' as const, icon: <Person fontSize="small" />, label: 'Assistente' };
      case 'visualizador':
        return { color: 'default' as const, icon: <Visibility fontSize="small" />, label: 'Visualizador' };
      default:
        return { color: 'default' as const, icon: null, label: perfil };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ativo':
        return { color: 'success' as const, label: 'Ativo' };
      case 'inativo':
        return { color: 'default' as const, label: 'Inativo' };
      default:
        return { color: 'default' as const, label: status };
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, colaborador: typeof mockColaboradores[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedColaborador(colaborador);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (editing = false) => {
    setIsEditing(editing);
    if (editing && selectedColaborador) {
      setFormData({
        nome: selectedColaborador.nome,
        email: selectedColaborador.email,
        cpf: selectedColaborador.cpf,
        telefone: selectedColaborador.telefone,
        perfil: selectedColaborador.perfil,
        permissoesCustomizadas: permissoesPorPerfil[selectedColaborador.perfil],
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        perfil: 'assistente',
        permissoesCustomizadas: permissoesPorPerfil['assistente'],
      });
    }
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleVerDetalhes = () => {
    setDetalhesDialogOpen(true);
    handleMenuClose();
  };

  const handlePerfilChange = (perfil: typeof formData.perfil) => {
    setFormData({
      ...formData,
      perfil,
      permissoesCustomizadas: permissoesPorPerfil[perfil],
    });
  };

  // Estatísticas
  const stats = {
    total: mockColaboradores.length,
    ativos: mockColaboradores.filter(c => c.status === 'ativo').length,
    com2FA: mockColaboradores.filter(c => c.twoFactorEnabled).length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Equipe do Escritório
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os colaboradores e suas permissões de acesso
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => handleOpenDialog(false)}
        >
          Convidar Colaborador
        </Button>
      </Box>

      {/* Cards de estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total de Colaboradores</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.ativos}</Typography>
                  <Typography variant="body2" color="text.secondary">Colaboradores Ativos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                  <Security />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.com2FA}</Typography>
                  <Typography variant="body2" color="text.secondary">Com 2FA Ativado</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Busca e filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.label}
                  <Chip label={tab.count} size="small" color={index === activeTab ? 'primary' : 'default'} />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tabela de colaboradores */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Colaborador</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Clientes</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>2FA</TableCell>
                <TableCell>Último Acesso</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredColaboradores.map((colaborador) => {
                const perfilConfig = getPerfilConfig(colaborador.perfil);
                const statusConfig = getStatusConfig(colaborador.status);
                return (
                  <TableRow key={colaborador.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {colaborador.nome.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {colaborador.nome}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {colaborador.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={perfilConfig.icon}
                        label={perfilConfig.label}
                        size="small"
                        color={perfilConfig.color}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig.label}
                        size="small"
                        color={statusConfig.color}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{colaborador.clientesAtribuidos}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{colaborador.ticketsResolvidos}</Typography>
                    </TableCell>
                    <TableCell>
                      {colaborador.twoFactorEnabled ? (
                        <Chip icon={<CheckCircle />} label="Ativo" size="small" color="success" variant="outlined" />
                      ) : (
                        <Chip label="Inativo" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={format(new Date(colaborador.ultimoAcesso), "dd/MM/yyyy 'às' HH:mm")}>
                        <Typography variant="body2">
                          {formatDistanceToNow(new Date(colaborador.ultimoAcesso), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, colaborador)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleVerDetalhes}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Ver detalhes
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog(true)}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><History fontSize="small" /></ListItemIcon>
          Histórico de acessos
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><LockReset fontSize="small" /></ListItemIcon>
          Resetar senha
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><VpnKey fontSize="small" /></ListItemIcon>
          Revogar sessões
        </MenuItem>
        <Divider />
        {selectedColaborador?.status === 'ativo' ? (
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <ListItemIcon><PersonOff fontSize="small" color="error" /></ListItemIcon>
            Desativar colaborador
          </MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
            Reativar colaborador
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de cadastro/edição */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {isEditing ? 'Editar Colaborador' : 'Convidar Novo Colaborador'}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Dados Pessoais
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Email Corporativo"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  helperText="Será usado para login"
                />
                <TextField
                  fullWidth
                  label="CPF"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Perfil e Permissões
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Perfil de Acesso</InputLabel>
                <Select
                  value={formData.perfil}
                  label="Perfil de Acesso"
                  onChange={(e) => handlePerfilChange(e.target.value as typeof formData.perfil)}
                >
                  <MenuItem value="administrador">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminPanelSettings fontSize="small" color="error" />
                      Administrador (Acesso total)
                    </Box>
                  </MenuItem>
                  <MenuItem value="contador">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security fontSize="small" color="primary" />
                      Contador (Clientes, Notas, Guias)
                    </Box>
                  </MenuItem>
                  <MenuItem value="assistente">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="info" />
                      Assistente (Documentos, Tickets)
                    </Box>
                  </MenuItem>
                  <MenuItem value="visualizador">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Visibility fontSize="small" />
                      Visualizador (Somente consulta)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Paper variant="outlined" sx={{ p: 2, maxHeight: 250, overflow: 'auto' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Permissões do perfil:
                </Typography>
                <List dense>
                  {permissoesDisponiveis.map((permissao) => (
                    <ListItem key={permissao.id} disablePadding>
                      <Checkbox
                        edge="start"
                        checked={formData.permissoesCustomizadas.includes(permissao.id)}
                        disabled={formData.perfil === 'administrador'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              permissoesCustomizadas: [...formData.permissoesCustomizadas, permissao.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              permissoesCustomizadas: formData.permissoesCustomizadas.filter(p => p !== permissao.id),
                            });
                          }
                        }}
                      />
                      <ListItemText
                        primary={permissao.nome}
                        secondary={permissao.descricao}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

          {!isEditing && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Um email de convite será enviado para o colaborador definir sua senha e configurar 2FA.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={isEditing ? <CheckCircle /> : <Send />}
          >
            {isEditing ? 'Salvar Alterações' : 'Enviar Convite'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de detalhes */}
      <Dialog
        open={detalhesDialogOpen}
        onClose={() => setDetalhesDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
              {selectedColaborador?.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedColaborador?.nome}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedColaborador?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Informações Pessoais
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">CPF:</Typography>
                    <Typography variant="body2">{selectedColaborador?.cpf}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Telefone:</Typography>
                    <Typography variant="body2">{selectedColaborador?.telefone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Cadastro:</Typography>
                    <Typography variant="body2">
                      {selectedColaborador?.dataCadastro && format(new Date(selectedColaborador.dataCadastro), 'dd/MM/yyyy')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Perfil:</Typography>
                    <Chip
                      label={getPerfilConfig(selectedColaborador?.perfil || '').label}
                      size="small"
                      color={getPerfilConfig(selectedColaborador?.perfil || '').color}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Métricas
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Clientes atribuídos:</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedColaborador?.clientesAtribuidos}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Tickets resolvidos:</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedColaborador?.ticketsResolvidos}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Último acesso:</Typography>
                    <Typography variant="body2">
                      {selectedColaborador?.ultimoAcesso && format(new Date(selectedColaborador.ultimoAcesso), "dd/MM/yyyy 'às' HH:mm")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">2FA:</Typography>
                    <Chip
                      label={selectedColaborador?.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                      size="small"
                      color={selectedColaborador?.twoFactorEnabled ? 'success' : 'default'}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Permissões Atribuídas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {permissoesPorPerfil[selectedColaborador?.perfil || 'visualizador'].map((permId) => {
                    const perm = permissoesDisponiveis.find(p => p.id === permId);
                    return perm && (
                      <Chip
                        key={permId}
                        label={perm.nome}
                        size="small"
                        variant="outlined"
                        icon={<CheckCircle />}
                        color="success"
                      />
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalhesDialogOpen(false)}>
            Fechar
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => {
              setDetalhesDialogOpen(false);
              handleOpenDialog(true);
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipePage;
