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
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Block,
  CheckCircle,
  Business,
  Receipt,
  Assignment,
  Warning,
  Download,
  Upload,
  Mail,
  Phone,
  Person,
  AttachMoney,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data
const mockClientes = [
  {
    id: '1',
    cnpj: '12.345.678/0001-99',
    razaoSocial: 'Tech Solutions LTDA',
    nomeFantasia: 'Tech Solutions',
    email: 'contato@techsolutions.com.br',
    telefone: '(11) 99999-1234',
    responsavel: 'João Silva',
    status: 'ativo' as const,
    regime: 'simples' as const,
    dataContrato: '2023-01-15',
    ultimaAtividade: '2025-12-13T10:30:00',
    notasEmitidas: 156,
    faturamentoMensal: 185000,
    guiasPendentes: 2,
    ticketsAbertos: 1,
    alertas: 1,
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '2',
    cnpj: '98.765.432/0001-11',
    razaoSocial: 'Comércio ABC ME',
    nomeFantasia: 'Loja ABC',
    email: 'financeiro@lojabc.com.br',
    telefone: '(11) 98888-5678',
    responsavel: 'Maria Santos',
    status: 'inadimplente' as const,
    regime: 'simples' as const,
    dataContrato: '2022-06-20',
    ultimaAtividade: '2025-12-10T15:45:00',
    notasEmitidas: 89,
    faturamentoMensal: 45000,
    guiasPendentes: 4,
    ticketsAbertos: 0,
    alertas: 3,
    cidade: 'Campinas',
    uf: 'SP',
  },
  {
    id: '3',
    cnpj: '11.222.333/0001-44',
    razaoSocial: 'Serviços XYZ LTDA',
    nomeFantasia: 'XYZ Consultoria',
    email: 'contato@xyzconsult.com.br',
    telefone: '(11) 97777-9012',
    responsavel: 'Pedro Costa',
    status: 'ativo' as const,
    regime: 'lucro_presumido' as const,
    dataContrato: '2024-03-10',
    ultimaAtividade: '2025-12-13T09:15:00',
    notasEmitidas: 234,
    faturamentoMensal: 320000,
    guiasPendentes: 1,
    ticketsAbertos: 2,
    alertas: 1,
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '4',
    cnpj: '55.666.777/0001-88',
    razaoSocial: 'Indústria 123 LTDA',
    nomeFantasia: 'Indústria 123',
    email: 'financeiro@ind123.com.br',
    telefone: '(19) 96666-3456',
    responsavel: 'Ana Oliveira',
    status: 'ativo' as const,
    regime: 'lucro_real' as const,
    dataContrato: '2021-09-05',
    ultimaAtividade: '2025-12-12T14:20:00',
    notasEmitidas: 512,
    faturamentoMensal: 890000,
    guiasPendentes: 0,
    ticketsAbertos: 3,
    alertas: 0,
    cidade: 'Jundiaí',
    uf: 'SP',
  },
  {
    id: '5',
    cnpj: '33.444.555/0001-66',
    razaoSocial: 'Consultoria DEF ME',
    nomeFantasia: 'DEF Consulting',
    email: 'contato@defconsulting.com.br',
    telefone: '(11) 95555-7890',
    responsavel: 'Carlos Lima',
    status: 'bloqueado' as const,
    regime: 'simples' as const,
    dataContrato: '2023-08-12',
    ultimaAtividade: '2025-11-20T11:00:00',
    notasEmitidas: 45,
    faturamentoMensal: 28000,
    guiasPendentes: 6,
    ticketsAbertos: 1,
    alertas: 5,
    cidade: 'Osasco',
    uf: 'SP',
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCliente, setSelectedCliente] = useState<typeof mockClientes[0] | null>(null);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [filtroRegime, setFiltroRegime] = useState('todos');

  const tabs = [
    { label: 'Todos', count: mockClientes.length },
    { label: 'Ativos', count: mockClientes.filter(c => c.status === 'ativo').length },
    { label: 'Inadimplentes', count: mockClientes.filter(c => c.status === 'inadimplente').length },
    { label: 'Bloqueados', count: mockClientes.filter(c => c.status === 'bloqueado').length },
  ];

  const filteredClientes = mockClientes.filter(cliente => {
    const matchesSearch =
      cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cnpj.includes(searchTerm) ||
      cliente.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 1) matchesTab = cliente.status === 'ativo';
    if (activeTab === 2) matchesTab = cliente.status === 'inadimplente';
    if (activeTab === 3) matchesTab = cliente.status === 'bloqueado';
    
    const matchesRegime = filtroRegime === 'todos' || cliente.regime === filtroRegime;
    
    return matchesSearch && matchesTab && matchesRegime;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, cliente: typeof mockClientes[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedCliente(cliente);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDetalhes = (cliente: typeof mockClientes[0]) => {
    setSelectedCliente(cliente);
    setDetalhesDialogOpen(true);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'inadimplente': return 'warning';
      case 'bloqueado': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inadimplente': return 'Inadimplente';
      case 'bloqueado': return 'Bloqueado';
      default: return status;
    }
  };

  const getRegimeLabel = (regime: string) => {
    switch (regime) {
      case 'simples': return 'Simples Nacional';
      case 'lucro_presumido': return 'Lucro Presumido';
      case 'lucro_real': return 'Lucro Real';
      default: return regime;
    }
  };

  // Métricas
  const totalFaturamento = mockClientes.reduce((sum, c) => sum + c.faturamentoMensal, 0);
  const totalNotas = mockClientes.reduce((sum, c) => sum + c.notasEmitidas, 0);
  const totalGuiasPendentes = mockClientes.reduce((sum, c) => sum + c.guiasPendentes, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Gestão de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie todas as empresas clientes do escritório
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Download />} variant="outlined">
            Exportar
          </Button>
          <Button startIcon={<Add />} variant="contained">
            Novo Cliente
          </Button>
        </Box>
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                <Business />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {mockClientes.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Clientes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                <AttachMoney />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatCurrency(totalFaturamento)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Faturamento Mensal
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                <Receipt />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalNotas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Notas Emitidas (Mês)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: totalGuiasPendentes > 5 ? 'warning.50' : 'background.paper' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                <Warning />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                  {totalGuiasPendentes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guias Pendentes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Card */}
      <Card>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    <Chip
                      label={tab.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: activeTab === index ? 'primary.main' : 'grey.200',
                        color: activeTab === index ? 'white' : 'text.secondary',
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          {/* Filtros */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar por razão social, CNPJ, responsável..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 400 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Regime Tributário</InputLabel>
              <Select
                value={filtroRegime}
                label="Regime Tributário"
                onChange={(e) => setFiltroRegime(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="simples">Simples Nacional</MenuItem>
                <MenuItem value="lucro_presumido">Lucro Presumido</MenuItem>
                <MenuItem value="lucro_real">Lucro Real</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Tabela */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Regime</TableCell>
                  <TableCell align="center">Notas</TableCell>
                  <TableCell align="right">Faturamento</TableCell>
                  <TableCell align="center">Pendências</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Última Atividade</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClientes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((cliente) => (
                    <TableRow
                      key={cliente.id}
                      hover
                      sx={{
                        opacity: cliente.status === 'bloqueado' ? 0.6 : 1,
                        bgcolor: cliente.alertas > 2 ? 'error.50' : 'transparent',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {cliente.nomeFantasia.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {cliente.nomeFantasia}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {cliente.cnpj}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRegimeLabel(cliente.regime)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {cliente.notasEmitidas}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(cliente.faturamentoMensal)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          {cliente.guiasPendentes > 0 && (
                            <Tooltip title="Guias pendentes">
                              <Chip
                                label={cliente.guiasPendentes}
                                size="small"
                                color="warning"
                                sx={{ minWidth: 28, height: 22 }}
                              />
                            </Tooltip>
                          )}
                          {cliente.ticketsAbertos > 0 && (
                            <Tooltip title="Tickets abertos">
                              <Chip
                                label={cliente.ticketsAbertos}
                                size="small"
                                color="info"
                                sx={{ minWidth: 28, height: 22 }}
                              />
                            </Tooltip>
                          )}
                          {cliente.guiasPendentes === 0 && cliente.ticketsAbertos === 0 && (
                            <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusLabel(cliente.status)}
                          size="small"
                          color={getStatusColor(cliente.status) as 'success' | 'warning' | 'error'}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(cliente.ultimaAtividade), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalhes">
                          <IconButton size="small" onClick={() => handleOpenDetalhes(cliente)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, cliente)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredClientes.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Clientes por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </Card>

      {/* Menu de Contexto */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => selectedCliente && handleOpenDetalhes(selectedCliente)}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Ver Detalhes
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Receipt fontSize="small" /></ListItemIcon>
          Ver Notas
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Assignment fontSize="small" /></ListItemIcon>
          Ver Guias
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Upload fontSize="small" /></ListItemIcon>
          Enviar Documento
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Mail fontSize="small" /></ListItemIcon>
          Enviar Mensagem
        </MenuItem>
        <Divider />
        {selectedCliente?.status === 'ativo' ? (
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <ListItemIcon><Block fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            Bloquear Acesso
          </MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose} sx={{ color: 'success.main' }}>
            <ListItemIcon><CheckCircle fontSize="small" sx={{ color: 'success.main' }} /></ListItemIcon>
            Desbloquear
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de Detalhes */}
      <Dialog
        open={detalhesDialogOpen}
        onClose={() => setDetalhesDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
              {selectedCliente?.nomeFantasia.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedCliente?.nomeFantasia}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCliente?.razaoSocial}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCliente && (
            <Grid container spacing={3}>
              {/* Informações Gerais */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Informações Gerais
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">CNPJ</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedCliente.cnpj}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Regime</Typography>
                    <Chip label={getRegimeLabel(selectedCliente.regime)} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={getStatusLabel(selectedCliente.status)}
                      size="small"
                      color={getStatusColor(selectedCliente.status) as 'success' | 'warning' | 'error'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Cliente desde</Typography>
                    <Typography variant="body2">{format(new Date(selectedCliente.dataContrato), 'dd/MM/yyyy')}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Contato */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contato
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedCliente.responsavel}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedCliente.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedCliente.telefone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedCliente.cidade} - {selectedCliente.uf}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Métricas */}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  Métricas do Mês
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {selectedCliente.notasEmitidas}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Notas Emitidas
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {formatCurrency(selectedCliente.faturamentoMensal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Faturamento
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined" sx={{ bgcolor: selectedCliente.guiasPendentes > 0 ? 'warning.50' : 'transparent' }}>
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: selectedCliente.guiasPendentes > 0 ? 'warning.main' : 'success.main' }}>
                          {selectedCliente.guiasPendentes}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Guias Pendentes
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: selectedCliente.ticketsAbertos > 0 ? 'info.main' : 'text.secondary' }}>
                          {selectedCliente.ticketsAbertos}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tickets Abertos
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Alertas */}
              {selectedCliente.alertas > 0 && (
                <Grid item xs={12}>
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Este cliente possui <strong>{selectedCliente.alertas} alerta(s)</strong> que requerem atenção.
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalhesDialogOpen(false)}>
            Fechar
          </Button>
          <Button variant="outlined" startIcon={<Mail />}>
            Enviar Mensagem
          </Button>
          <Button variant="contained" startIcon={<Edit />}>
            Editar Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientesPage;
