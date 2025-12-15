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
  TablePagination,
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
  Alert,
  Paper,
  Autocomplete,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Edit,
  Block,
  LockReset,
  PersonAdd,
  PersonOff,
  Business,
  VpnKey,
  LinkOff,
  Link as LinkIcon,
  FilterList,
  Download,
  Security,
  History,
  CheckCircle,
  Warning,
  Cancel,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data de usuários de todas as empresas
const mockUsuarios = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@techsolutions.com.br',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-1234',
    empresas: [
      { id: '1', nome: 'Tech Solutions LTDA', perfil: 'admin' as const },
    ],
    status: 'ativo' as const,
    dataCadastro: '2023-01-15',
    ultimoAcesso: '2025-12-13T10:30:00',
    acessos30dias: 45,
    dispositivosAtivos: 2,
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@techsolutions.com.br',
    cpf: '987.654.321-00',
    telefone: '(11) 98888-5678',
    empresas: [
      { id: '1', nome: 'Tech Solutions LTDA', perfil: 'operador' as const },
      { id: '3', nome: 'Serviços XYZ LTDA', perfil: 'visualizador' as const },
    ],
    status: 'ativo' as const,
    dataCadastro: '2023-03-20',
    ultimoAcesso: '2025-12-12T15:45:00',
    acessos30dias: 38,
    dispositivosAtivos: 1,
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    email: 'pedro@lojabc.com.br',
    cpf: '456.789.123-00',
    telefone: '(11) 97777-9012',
    empresas: [
      { id: '2', nome: 'Comércio ABC ME', perfil: 'admin' as const },
    ],
    status: 'ativo' as const,
    dataCadastro: '2022-06-20',
    ultimoAcesso: '2025-12-10T09:15:00',
    acessos30dias: 22,
    dispositivosAtivos: 1,
  },
  {
    id: '4',
    nome: 'Ana Oliveira',
    email: 'ana.oliveira@xyzconsult.com.br',
    cpf: '789.123.456-00',
    telefone: '(11) 96666-3456',
    empresas: [
      { id: '3', nome: 'Serviços XYZ LTDA', perfil: 'admin' as const },
    ],
    status: 'bloqueado' as const,
    dataCadastro: '2024-03-10',
    ultimoAcesso: '2025-11-28T14:20:00',
    acessos30dias: 0,
    dispositivosAtivos: 0,
  },
  {
    id: '5',
    nome: 'Carlos Lima',
    email: 'carlos@ind123.com.br',
    cpf: '321.654.987-00',
    telefone: '(19) 95555-7890',
    empresas: [
      { id: '4', nome: 'Indústria 123 LTDA', perfil: 'admin' as const },
      { id: '5', nome: 'Consultoria DEF', perfil: 'operador' as const },
    ],
    status: 'ativo' as const,
    dataCadastro: '2021-09-05',
    ultimoAcesso: '2025-12-13T08:45:00',
    acessos30dias: 56,
    dispositivosAtivos: 3,
  },
  {
    id: '6',
    nome: 'Fernanda Rocha',
    email: 'fernanda@defconsulting.com.br',
    cpf: '654.321.987-00',
    telefone: '(11) 94444-1122',
    empresas: [
      { id: '5', nome: 'Consultoria DEF', perfil: 'visualizador' as const },
    ],
    status: 'inativo' as const,
    dataCadastro: '2023-08-12',
    ultimoAcesso: '2025-10-15T11:00:00',
    acessos30dias: 0,
    dispositivosAtivos: 0,
  },
  {
    id: '7',
    nome: 'Roberto Mendes',
    email: 'roberto@techsolutions.com.br',
    cpf: '147.258.369-00',
    telefone: '(11) 93333-4455',
    empresas: [
      { id: '1', nome: 'Tech Solutions LTDA', perfil: 'visualizador' as const },
    ],
    status: 'convite_pendente' as const,
    dataCadastro: '2025-12-10',
    ultimoAcesso: '',
    acessos30dias: 0,
    dispositivosAtivos: 0,
  },
];

const mockEmpresas = [
  { id: '1', nome: 'Tech Solutions LTDA' },
  { id: '2', nome: 'Comércio ABC ME' },
  { id: '3', nome: 'Serviços XYZ LTDA' },
  { id: '4', nome: 'Indústria 123 LTDA' },
  { id: '5', nome: 'Consultoria DEF' },
];

const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<typeof mockUsuarios[0] | null>(null);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>('');
  const [filtroPerfil, setFiltroPerfil] = useState('todos');

  const tabs = [
    { label: 'Todos', count: mockUsuarios.length },
    { label: 'Ativos', count: mockUsuarios.filter(u => u.status === 'ativo').length },
    { label: 'Bloqueados', count: mockUsuarios.filter(u => u.status === 'bloqueado').length },
    { label: 'Inativos', count: mockUsuarios.filter(u => u.status === 'inativo').length },
    { label: 'Convite Pendente', count: mockUsuarios.filter(u => u.status === 'convite_pendente').length },
    { label: 'Multi-empresa', count: mockUsuarios.filter(u => u.empresas.length > 1).length },
  ];

  const filteredUsuarios = mockUsuarios.filter(usuario => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cpf.includes(searchTerm) ||
      usuario.empresas.some(e => e.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesTab = true;
    if (activeTab === 1) matchesTab = usuario.status === 'ativo';
    if (activeTab === 2) matchesTab = usuario.status === 'bloqueado';
    if (activeTab === 3) matchesTab = usuario.status === 'inativo';
    if (activeTab === 4) matchesTab = usuario.status === 'convite_pendente';
    if (activeTab === 5) matchesTab = usuario.empresas.length > 1;

    let matchesEmpresa = true;
    if (filtroEmpresa) {
      matchesEmpresa = usuario.empresas.some(e => e.id === filtroEmpresa);
    }

    let matchesPerfil = true;
    if (filtroPerfil !== 'todos') {
      matchesPerfil = usuario.empresas.some(e => e.perfil === filtroPerfil);
    }

    return matchesSearch && matchesTab && matchesEmpresa && matchesPerfil;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ativo':
        return { color: 'success' as const, icon: <CheckCircle fontSize="small" />, label: 'Ativo' };
      case 'bloqueado':
        return { color: 'error' as const, icon: <Block fontSize="small" />, label: 'Bloqueado' };
      case 'inativo':
        return { color: 'default' as const, icon: <PersonOff fontSize="small" />, label: 'Inativo' };
      case 'convite_pendente':
        return { color: 'warning' as const, icon: <Warning fontSize="small" />, label: 'Convite Pendente' };
      default:
        return { color: 'default' as const, icon: null, label: status };
    }
  };

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case 'admin': return 'error';
      case 'operador': return 'primary';
      case 'visualizador': return 'default';
      default: return 'default';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, usuario: typeof mockUsuarios[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedUsuario(usuario);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVerDetalhes = () => {
    setDetalhesDialogOpen(true);
    handleMenuClose();
  };

  // Estatísticas
  const stats = {
    totalUsuarios: mockUsuarios.length,
    ativos: mockUsuarios.filter(u => u.status === 'ativo').length,
    multiEmpresa: mockUsuarios.filter(u => u.empresas.length > 1).length,
    semAcesso30dias: mockUsuarios.filter(u => u.acessos30dias === 0).length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Gestão de Usuários
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão consolidada de todos os usuários de todas as empresas
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Download />} variant="outlined">
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Cards de estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <Security />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.totalUsuarios}</Typography>
                  <Typography variant="body2" color="text.secondary">Total de Usuários</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.ativos}</Typography>
                  <Typography variant="body2" color="text.secondary">Usuários Ativos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.multiEmpresa}</Typography>
                  <Typography variant="body2" color="text.secondary">Multi-empresa</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.semAcesso30dias}</Typography>
                  <Typography variant="body2" color="text.secondary">Sem acesso (30d)</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros e busca */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nome, email, CPF ou empresa..."
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
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                size="small"
                options={mockEmpresas}
                getOptionLabel={(option) => option.nome}
                value={mockEmpresas.find(e => e.id === filtroEmpresa) || null}
                onChange={(_, value) => setFiltroEmpresa(value?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Filtrar por empresa" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Perfil</InputLabel>
                <Select
                  value={filtroPerfil}
                  label="Perfil"
                  onChange={(e) => setFiltroPerfil(e.target.value)}
                >
                  <MenuItem value="todos">Todos os perfis</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="operador">Operador</MenuItem>
                  <MenuItem value="visualizador">Visualizador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setFiltroEmpresa('');
                  setFiltroPerfil('todos');
                  setActiveTab(0);
                }}
              >
                Limpar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
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

      {/* Tabela de usuários */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuário</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Empresa(s)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Último Acesso</TableCell>
                <TableCell>Acessos (30d)</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsuarios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((usuario) => {
                  const statusConfig = getStatusConfig(usuario.status);
                  return (
                    <TableRow key={usuario.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {usuario.nome.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {usuario.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {usuario.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{usuario.cpf}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {usuario.empresas.map((empresa, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                {empresa.nome}
                              </Typography>
                              <Chip
                                label={empresa.perfil}
                                size="small"
                                color={getPerfilColor(empresa.perfil) as any}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            </Box>
                          ))}
                          {usuario.empresas.length > 1 && (
                            <Chip
                              icon={<LinkIcon />}
                              label="Multi-empresa"
                              size="small"
                              variant="outlined"
                              color="info"
                              sx={{ mt: 0.5, width: 'fit-content' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusConfig.icon}
                          label={statusConfig.label}
                          size="small"
                          color={statusConfig.color}
                        />
                      </TableCell>
                      <TableCell>
                        {usuario.ultimoAcesso ? (
                          <Tooltip title={format(new Date(usuario.ultimoAcesso), "dd/MM/yyyy 'às' HH:mm")}>
                            <Typography variant="body2">
                              {formatDistanceToNow(new Date(usuario.ultimoAcesso), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Nunca acessou
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={usuario.acessos30dias === 0 ? 'error' : 'text.primary'}
                          fontWeight={usuario.acessos30dias === 0 ? 600 : 400}
                        >
                          {usuario.acessos30dias}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuOpen(e, usuario)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredUsuarios.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
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
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
          Vincular a empresa
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><LinkOff fontSize="small" /></ListItemIcon>
          Desvincular empresa
        </MenuItem>
        <Divider />
        {selectedUsuario?.status === 'bloqueado' ? (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
            Desbloquear usuário
          </MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <ListItemIcon><Block fontSize="small" color="error" /></ListItemIcon>
            Bloquear usuário
          </MenuItem>
        )}
      </Menu>

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
              {selectedUsuario?.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedUsuario?.nome}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUsuario?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Informações Pessoais
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">CPF:</Typography>
                    <Typography variant="body2">{selectedUsuario?.cpf}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Telefone:</Typography>
                    <Typography variant="body2">{selectedUsuario?.telefone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Data de cadastro:</Typography>
                    <Typography variant="body2">
                      {selectedUsuario?.dataCadastro && format(new Date(selectedUsuario.dataCadastro), 'dd/MM/yyyy')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Chip
                      label={getStatusConfig(selectedUsuario?.status || '').label}
                      size="small"
                      color={getStatusConfig(selectedUsuario?.status || '').color}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Estatísticas de Acesso
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Último acesso:</Typography>
                    <Typography variant="body2">
                      {selectedUsuario?.ultimoAcesso
                        ? format(new Date(selectedUsuario.ultimoAcesso), "dd/MM/yyyy 'às' HH:mm")
                        : 'Nunca acessou'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Acessos (30 dias):</Typography>
                    <Typography variant="body2">{selectedUsuario?.acessos30dias}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Dispositivos ativos:</Typography>
                    <Typography variant="body2">{selectedUsuario?.dispositivosAtivos}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Empresas Vinculadas
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Empresa</TableCell>
                      <TableCell>Perfil</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedUsuario?.empresas.map((empresa, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{empresa.nome}</TableCell>
                        <TableCell>
                          <Chip
                            label={empresa.perfil}
                            size="small"
                            color={getPerfilColor(empresa.perfil) as any}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Alterar perfil">
                            <IconButton size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Desvincular">
                            <IconButton size="small" color="error">
                              <LinkOff fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalhesDialogOpen(false)}>
            Fechar
          </Button>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => setDetalhesDialogOpen(false)}
          >
            Vincular a Empresa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuariosPage;
