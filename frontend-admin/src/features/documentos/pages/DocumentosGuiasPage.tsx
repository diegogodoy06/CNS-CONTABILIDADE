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
  Paper,
  Autocomplete,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Download,
  Upload,
  Description,
  PictureAsPdf,
  Image,
  AttachMoney,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Schedule,
  Business,
  Folder,
  CloudUpload,
  Delete,
  Close,
  Receipt,
  Gavel,
  FilterList,
} from '@mui/icons-material';
import { format, differenceInDays, isPast, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data de documentos
const mockDocumentos = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    nome: 'Contrato Social',
    categoria: 'contrato' as const,
    tipo: 'pdf',
    tamanho: 1250000,
    dataUpload: '2025-12-10T14:30:00',
    uploadPor: 'Carlos Contador',
    visibilidade: 'cliente' as const,
  },
  {
    id: '2',
    clienteId: '3',
    clienteNome: 'Serviços XYZ LTDA',
    nome: 'Certificado Digital A1',
    categoria: 'certificado' as const,
    tipo: 'pfx',
    tamanho: 3200,
    dataUpload: '2025-12-08T09:15:00',
    uploadPor: 'Ana Assistente',
    visibilidade: 'interno' as const,
  },
  {
    id: '3',
    clienteId: '2',
    clienteNome: 'Comércio ABC ME',
    nome: 'Procuração',
    categoria: 'procuracao' as const,
    tipo: 'pdf',
    tamanho: 850000,
    dataUpload: '2025-12-05T11:00:00',
    uploadPor: 'Carlos Contador',
    visibilidade: 'cliente' as const,
  },
];

// Mock data de guias
const mockGuias = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    tipo: 'ISS' as const,
    competencia: '11/2025',
    vencimento: '2025-12-13',
    valor: 1250.00,
    status: 'vencendo_hoje' as const,
    codigoBarras: '12345.67890 12345.678901 12345.678901 1 12340000125000',
    arquivo: 'iss_11_2025.pdf',
  },
  {
    id: '2',
    clienteId: '2',
    clienteNome: 'Comércio ABC ME',
    tipo: 'FGTS' as const,
    competencia: '11/2025',
    vencimento: '2025-12-07',
    valor: 4580.00,
    status: 'vencida' as const,
    codigoBarras: '98765.43210 98765.432109 98765.432109 1 98760000458000',
    arquivo: 'fgts_11_2025.pdf',
    diasAtraso: 6,
  },
  {
    id: '3',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    tipo: 'DAS' as const,
    competencia: '11/2025',
    vencimento: '2025-12-20',
    valor: 892.45,
    status: 'pendente' as const,
    codigoBarras: '11111.22222 33333.444445 55555.666667 1 11110000089245',
    arquivo: 'das_11_2025.pdf',
  },
  {
    id: '4',
    clienteId: '3',
    clienteNome: 'Serviços XYZ LTDA',
    tipo: 'IRPJ' as const,
    competencia: '3T/2025',
    vencimento: '2025-12-31',
    valor: 15800.00,
    status: 'pendente' as const,
    codigoBarras: '22222.33333 44444.555556 66666.777778 1 22220001580000',
    arquivo: 'irpj_3t_2025.pdf',
  },
  {
    id: '5',
    clienteId: '4',
    clienteNome: 'Indústria 123 LTDA',
    tipo: 'INSS' as const,
    competencia: '11/2025',
    vencimento: '2025-12-10',
    valor: 8500.00,
    status: 'paga' as const,
    codigoBarras: '33333.44444 55555.666667 77777.888889 1 33330000850000',
    arquivo: 'inss_11_2025.pdf',
    dataPagamento: '2025-12-09',
  },
  {
    id: '6',
    clienteId: '5',
    clienteNome: 'Consultoria DEF',
    tipo: 'ISS' as const,
    competencia: '11/2025',
    vencimento: '2025-12-15',
    valor: 420.00,
    status: 'pendente' as const,
    codigoBarras: '44444.55555 66666.777778 88888.999990 1 44440000042000',
    arquivo: 'iss_11_2025.pdf',
  },
];

const mockClientes = [
  { id: '1', nome: 'Tech Solutions LTDA' },
  { id: '2', nome: 'Comércio ABC ME' },
  { id: '3', nome: 'Serviços XYZ LTDA' },
  { id: '4', nome: 'Indústria 123 LTDA' },
  { id: '5', nome: 'Consultoria DEF' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentosGuiasPage = () => {
  const [activeSection, setActiveSection] = useState<'guias' | 'documentos'>('guias');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Tabs para guias
  const guiasTabs = [
    { label: 'Todas', count: mockGuias.length },
    { label: 'Vencidas', count: mockGuias.filter(g => g.status === 'vencida').length, color: 'error' },
    { label: 'Vencendo Hoje', count: mockGuias.filter(g => g.status === 'vencendo_hoje').length, color: 'warning' },
    { label: 'Pendentes', count: mockGuias.filter(g => g.status === 'pendente').length, color: 'info' },
    { label: 'Pagas', count: mockGuias.filter(g => g.status === 'paga').length, color: 'success' },
  ];

  const documentosTabs = [
    { label: 'Todos', count: mockDocumentos.length },
    { label: 'Contratos', count: mockDocumentos.filter(d => d.categoria === 'contrato').length },
    { label: 'Certificados', count: mockDocumentos.filter(d => d.categoria === 'certificado').length },
    { label: 'Procurações', count: mockDocumentos.filter(d => d.categoria === 'procuracao').length },
  ];

  const filteredGuias = mockGuias.filter(guia => {
    const matchesSearch =
      guia.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.competencia.includes(searchTerm);

    let matchesTab = true;
    if (activeTab === 1) matchesTab = guia.status === 'vencida';
    if (activeTab === 2) matchesTab = guia.status === 'vencendo_hoje';
    if (activeTab === 3) matchesTab = guia.status === 'pendente';
    if (activeTab === 4) matchesTab = guia.status === 'paga';

    let matchesCliente = !filtroCliente || guia.clienteId === filtroCliente;
    let matchesTipo = filtroTipo === 'todos' || guia.tipo === filtroTipo;

    return matchesSearch && matchesTab && matchesCliente && matchesTipo;
  });

  const filteredDocumentos = mockDocumentos.filter(doc => {
    const matchesSearch =
      doc.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.nome.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab === 1) matchesTab = doc.categoria === 'contrato';
    if (activeTab === 2) matchesTab = doc.categoria === 'certificado';
    if (activeTab === 3) matchesTab = doc.categoria === 'procuracao';

    let matchesCliente = !filtroCliente || doc.clienteId === filtroCliente;

    return matchesSearch && matchesTab && matchesCliente;
  });

  const getGuiaStatusConfig = (status: string) => {
    switch (status) {
      case 'vencida':
        return { color: 'error' as const, icon: <ErrorIcon fontSize="small" />, label: 'Vencida' };
      case 'vencendo_hoje':
        return { color: 'warning' as const, icon: <Warning fontSize="small" />, label: 'Vence Hoje' };
      case 'pendente':
        return { color: 'info' as const, icon: <Schedule fontSize="small" />, label: 'Pendente' };
      case 'paga':
        return { color: 'success' as const, icon: <CheckCircle fontSize="small" />, label: 'Paga' };
      default:
        return { color: 'default' as const, icon: null, label: status };
    }
  };

  const getTipoGuiaColor = (tipo: string) => {
    switch (tipo) {
      case 'ISS': return 'primary';
      case 'DAS': return 'success';
      case 'FGTS': return 'info';
      case 'INSS': return 'secondary';
      case 'IRPJ': return 'warning';
      case 'CSLL': return 'error';
      default: return 'default';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Estatísticas das guias
  const guiasStats = {
    vencidas: mockGuias.filter(g => g.status === 'vencida').length,
    valorVencido: mockGuias.filter(g => g.status === 'vencida').reduce((sum, g) => sum + g.valor, 0),
    vencendoHoje: mockGuias.filter(g => g.status === 'vencendo_hoje').length,
    totalPendente: mockGuias.filter(g => ['pendente', 'vencendo_hoje'].includes(g.status)).reduce((sum, g) => sum + g.valor, 0),
  };

  const tiposGuia = ['ISS', 'DAS', 'FGTS', 'INSS', 'IRPJ', 'CSLL', 'PIS', 'COFINS'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Documentos e Guias
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie documentos e guias de impostos de todos os clientes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={activeSection === 'guias' ? 'contained' : 'outlined'}
            startIcon={<Gavel />}
            onClick={() => { setActiveSection('guias'); setActiveTab(0); }}
          >
            Guias
          </Button>
          <Button
            variant={activeSection === 'documentos' ? 'contained' : 'outlined'}
            startIcon={<Folder />}
            onClick={() => { setActiveSection('documentos'); setActiveTab(0); }}
          >
            Documentos
          </Button>
        </Box>
      </Box>

      {activeSection === 'guias' ? (
        <>
          {/* Cards de estatísticas de guias */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                        {guiasStats.vencidas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Guias Vencidas</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'error.light', width: 48, height: 48 }}>
                      <ErrorIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                        {formatCurrency(guiasStats.valorVencido)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Valor Vencido</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'error.light', width: 48, height: 48 }}>
                      <AttachMoney />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {guiasStats.vencendoHoje}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Vencendo Hoje</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                      <Warning />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderLeft: 4, borderColor: 'info.main' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatCurrency(guiasStats.totalPendente)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Pendente</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                      <Schedule />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filtros */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar por cliente, tipo ou competência..."
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
                    options={mockClientes}
                    getOptionLabel={(option) => option.nome}
                    value={mockClientes.find(c => c.id === filtroCliente) || null}
                    onChange={(_, value) => setFiltroCliente(value?.id || '')}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Filtrar por cliente" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={filtroTipo}
                      label="Tipo"
                      onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                      <MenuItem value="todos">Todos</MenuItem>
                      {tiposGuia.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setSearchTerm('');
                        setFiltroCliente('');
                        setFiltroTipo('todos');
                        setActiveTab(0);
                      }}
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Upload />}
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      Upload em Lote
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabs de guias */}
          <Paper sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {guiasTabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.label}
                      <Chip
                        label={tab.count}
                        size="small"
                        color={index === activeTab ? 'primary' : (tab.color as any || 'default')}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Paper>

          {/* Alerta de guias vencidas */}
          {guiasStats.vencidas > 0 && activeTab === 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <strong>{guiasStats.vencidas} guia(s) vencida(s)</strong> no valor total de {formatCurrency(guiasStats.valorVencido)}. 
              Regularize para evitar multas e juros.
            </Alert>
          )}

          {/* Tabela de guias */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Competência</TableCell>
                    <TableCell>Vencimento</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGuias
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((guia) => {
                      const statusConfig = getGuiaStatusConfig(guia.status);
                      return (
                        <TableRow
                          key={guia.id}
                          hover
                          sx={guia.status === 'vencida' ? { bgcolor: 'error.50' } : {}}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Business fontSize="small" color="action" />
                              <Typography variant="body2">{guia.clienteNome}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={guia.tipo}
                              size="small"
                              color={getTipoGuiaColor(guia.tipo) as any}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{guia.competencia}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {format(new Date(guia.vencimento), 'dd/MM/yyyy')}
                              </Typography>
                              {guia.diasAtraso && (
                                <Typography variant="caption" color="error">
                                  {guia.diasAtraso} dias em atraso
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(guia.valor)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={statusConfig.icon}
                              label={statusConfig.label}
                              size="small"
                              color={statusConfig.color}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Baixar PDF">
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </Tooltip>
                            <IconButton onClick={(e) => handleMenuOpen(e, guia)}>
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
              count={filteredGuias.length}
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
        </>
      ) : (
        <>
          {/* Seção de Documentos */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar por nome ou cliente..."
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
                    options={mockClientes}
                    getOptionLabel={(option) => option.nome}
                    value={mockClientes.find(c => c.id === filtroCliente) || null}
                    onChange={(_, value) => setFiltroCliente(value?.id || '')}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Filtrar por cliente" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchTerm('');
                        setFiltroCliente('');
                        setActiveTab(0);
                      }}
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CloudUpload />}
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      Upload Documento
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabs de documentos */}
          <Paper sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {documentosTabs.map((tab, index) => (
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

          {/* Tabela de documentos */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Documento</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Tamanho</TableCell>
                    <TableCell>Upload</TableCell>
                    <TableCell>Visibilidade</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDocumentos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'grey.200' }}>
                              {doc.tipo === 'pdf' ? <PictureAsPdf color="error" /> : <Description />}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>{doc.nome}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                .{doc.tipo.toUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{doc.clienteNome}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={doc.categoria.charAt(0).toUpperCase() + doc.categoria.slice(1)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatFileSize(doc.tamanho)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {format(new Date(doc.dataUpload), 'dd/MM/yyyy')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              por {doc.uploadPor}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={doc.visibilidade === 'cliente' ? 'Cliente' : 'Interno'}
                            size="small"
                            color={doc.visibilidade === 'cliente' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Baixar">
                            <IconButton size="small">
                              <Download />
                            </IconButton>
                          </Tooltip>
                          <IconButton onClick={(e) => handleMenuOpen(e, doc)}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredDocumentos.length}
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
        </>
      )}

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Download fontSize="small" /></ListItemIcon>
          Baixar
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
          Excluir
        </MenuItem>
      </Menu>

      {/* Dialog de Upload */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {activeSection === 'guias' ? 'Upload de Guias em Lote' : 'Upload de Documento'}
            </Typography>
            <IconButton onClick={() => setUploadDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              fullWidth
              options={mockClientes}
              getOptionLabel={(option) => option.nome}
              renderInput={(params) => (
                <TextField {...params} label="Cliente" required />
              )}
              sx={{ mb: 2 }}
            />

            {activeSection === 'guias' && (
              <TextField
                fullWidth
                label="Competência"
                placeholder="Ex: 12/2025"
                sx={{ mb: 2 }}
              />
            )}

            {activeSection === 'documentos' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categoria</InputLabel>
                <Select label="Categoria">
                  <MenuItem value="contrato">Contrato</MenuItem>
                  <MenuItem value="certificado">Certificado</MenuItem>
                  <MenuItem value="procuracao">Procuração</MenuItem>
                  <MenuItem value="outros">Outros</MenuItem>
                </Select>
              </FormControl>
            )}

            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                borderStyle: 'dashed',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Arraste arquivos aqui ou clique para selecionar
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activeSection === 'guias' 
                  ? 'Formatos aceitos: PDF. Máximo 10MB por arquivo.'
                  : 'Formatos aceitos: PDF, DOC, DOCX, JPG, PNG. Máximo 10MB.'
                }
              </Typography>
            </Paper>

            {activeSection === 'documentos' && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Visibilidade</InputLabel>
                <Select label="Visibilidade" defaultValue="cliente">
                  <MenuItem value="cliente">Visível para o cliente</MenuItem>
                  <MenuItem value="interno">Apenas interno</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" startIcon={<Upload />}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentosGuiasPage;
