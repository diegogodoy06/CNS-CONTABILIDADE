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
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Receipt,
  Download,
  Print,
  Cancel,
  CheckCircle,
  Schedule,
  Business,
  Person,
  AttachMoney,
  FilterList,
  Refresh,
  PictureAsPdf,
  Description,
  TrendingUp,
  TrendingDown,
  Close,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data de notas fiscais
const mockNotas = [
  {
    id: '1',
    numero: '1234',
    serie: '1',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    clienteCnpj: '12.345.678/0001-99',
    tomadorNome: 'Empresa Cliente ABC',
    tomadorDocumento: '98.765.432/0001-11',
    valor: 15000.00,
    valorIss: 750.00,
    aliquotaIss: 5,
    descricaoServico: 'Serviços de consultoria em TI',
    dataEmissao: '2025-12-13T10:30:00',
    status: 'emitida' as const,
    codigoVerificacao: 'ABC123DEF456',
    municipio: 'São Paulo',
  },
  {
    id: '2',
    numero: '1233',
    serie: '1',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    clienteCnpj: '12.345.678/0001-99',
    tomadorNome: 'Empresa XYZ',
    tomadorDocumento: '11.222.333/0001-44',
    valor: 8500.00,
    valorIss: 425.00,
    aliquotaIss: 5,
    descricaoServico: 'Desenvolvimento de software',
    dataEmissao: '2025-12-12T15:45:00',
    status: 'emitida' as const,
    codigoVerificacao: 'GHI789JKL012',
    municipio: 'São Paulo',
  },
  {
    id: '3',
    numero: '567',
    serie: '1',
    clienteId: '3',
    clienteNome: 'Serviços XYZ LTDA',
    clienteCnpj: '11.222.333/0001-44',
    tomadorNome: 'Cliente Final',
    tomadorDocumento: '55.666.777/0001-88',
    valor: 32000.00,
    valorIss: 960.00,
    aliquotaIss: 3,
    descricaoServico: 'Consultoria empresarial',
    dataEmissao: '2025-12-11T09:00:00',
    status: 'emitida' as const,
    codigoVerificacao: 'MNO345PQR678',
    municipio: 'São Paulo',
  },
  {
    id: '4',
    numero: '234',
    serie: '1',
    clienteId: '4',
    clienteNome: 'Indústria 123 LTDA',
    clienteCnpj: '55.666.777/0001-88',
    tomadorNome: 'Distribuidor Regional',
    tomadorDocumento: '33.444.555/0001-66',
    valor: 89000.00,
    valorIss: 4450.00,
    aliquotaIss: 5,
    descricaoServico: 'Serviços industriais especializados',
    dataEmissao: '2025-12-10T14:00:00',
    status: 'emitida' as const,
    codigoVerificacao: 'STU901VWX234',
    municipio: 'Jundiaí',
  },
  {
    id: '5',
    numero: '123',
    serie: '1',
    clienteId: '2',
    clienteNome: 'Comércio ABC ME',
    clienteCnpj: '98.765.432/0001-11',
    tomadorNome: 'Pessoa Física',
    tomadorDocumento: '123.456.789-00',
    valor: 500.00,
    valorIss: 25.00,
    aliquotaIss: 5,
    descricaoServico: 'Venda de serviços',
    dataEmissao: '2025-12-08T11:30:00',
    status: 'cancelada' as const,
    codigoVerificacao: 'YZA567BCD890',
    municipio: 'Campinas',
    motivoCancelamento: 'Dados do tomador incorretos',
  },
  {
    id: '6',
    numero: '1232',
    serie: '1',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    clienteCnpj: '12.345.678/0001-99',
    tomadorNome: 'Novo Cliente',
    tomadorDocumento: '44.555.666/0001-77',
    valor: 12000.00,
    valorIss: 600.00,
    aliquotaIss: 5,
    descricaoServico: 'Manutenção de sistemas',
    dataEmissao: '2025-12-13T08:00:00',
    status: 'pendente' as const,
    codigoVerificacao: '',
    municipio: 'São Paulo',
  },
];

const mockClientes = [
  { id: '1', nome: 'Tech Solutions LTDA', cnpj: '12.345.678/0001-99' },
  { id: '2', nome: 'Comércio ABC ME', cnpj: '98.765.432/0001-11' },
  { id: '3', nome: 'Serviços XYZ LTDA', cnpj: '11.222.333/0001-44' },
  { id: '4', nome: 'Indústria 123 LTDA', cnpj: '55.666.777/0001-88' },
  { id: '5', nome: 'Consultoria DEF', cnpj: '33.444.555/0001-66' },
];

const faturamentoSemanal = Array.from({ length: 7 }, (_, i) => ({
  data: format(subDays(new Date(), 6 - i), 'dd/MM'),
  valor: Math.floor(Math.random() * 150000) + 50000,
  notas: Math.floor(Math.random() * 30) + 10,
}));

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const NotasFiscaisPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNota, setSelectedNota] = useState<typeof mockNotas[0] | null>(null);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('todos');

  const tabs = [
    { label: 'Todas', count: mockNotas.length },
    { label: 'Emitidas', count: mockNotas.filter(n => n.status === 'emitida').length },
    { label: 'Pendentes', count: mockNotas.filter(n => n.status === 'pendente').length },
    { label: 'Canceladas', count: mockNotas.filter(n => n.status === 'cancelada').length },
  ];

  const filteredNotas = mockNotas.filter(nota => {
    const matchesSearch =
      nota.numero.includes(searchTerm) ||
      nota.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.tomadorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.codigoVerificacao.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab === 1) matchesTab = nota.status === 'emitida';
    if (activeTab === 2) matchesTab = nota.status === 'pendente';
    if (activeTab === 3) matchesTab = nota.status === 'cancelada';

    let matchesCliente = !filtroCliente || nota.clienteId === filtroCliente;
    let matchesMunicipio = filtroMunicipio === 'todos' || nota.municipio === filtroMunicipio;

    return matchesSearch && matchesTab && matchesCliente && matchesMunicipio;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'emitida':
        return { color: 'success' as const, icon: <CheckCircle fontSize="small" />, label: 'Emitida' };
      case 'pendente':
        return { color: 'warning' as const, icon: <Schedule fontSize="small" />, label: 'Pendente' };
      case 'cancelada':
        return { color: 'error' as const, icon: <Cancel fontSize="small" />, label: 'Cancelada' };
      default:
        return { color: 'default' as const, icon: null, label: status };
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, nota: typeof mockNotas[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedNota(nota);
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
    totalNotas: mockNotas.filter(n => n.status === 'emitida').length,
    valorTotal: mockNotas.filter(n => n.status === 'emitida').reduce((sum, n) => sum + n.valor, 0),
    issTotal: mockNotas.filter(n => n.status === 'emitida').reduce((sum, n) => sum + n.valorIss, 0),
    notasHoje: mockNotas.filter(n => {
      const hoje = new Date().toDateString();
      return new Date(n.dataEmissao).toDateString() === hoje && n.status === 'emitida';
    }).length,
  };

  const municipios = [...new Set(mockNotas.map(n => n.municipio))];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Notas Fiscais
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão consolidada de todas as NFS-e emitidas pelos clientes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Download />} variant="outlined">
            Exportar
          </Button>
          <Button startIcon={<Refresh />} variant="contained">
            Atualizar
          </Button>
        </Box>
      </Box>

      {/* Cards de estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.totalNotas}</Typography>
                  <Typography variant="body2" color="text.secondary">Notas Emitidas</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                  <Receipt />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(stats.valorTotal)}</Typography>
                  <Typography variant="body2" color="text.secondary">Valor Total</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(stats.issTotal)}</Typography>
                  <Typography variant="body2" color="text.secondary">ISS Total</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.notasHoje}</Typography>
                  <Typography variant="body2" color="text.secondary">Emitidas Hoje</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                  <Description />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfico de faturamento */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Faturamento dos Últimos 7 Dias</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={faturamentoSemanal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <RechartsTooltip
                formatter={(value: number) => [formatCurrency(value), 'Valor']}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="#1976d2"
                fill="#1976d2"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filtros e busca */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por número, cliente, tomador ou código..."
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Município</InputLabel>
                <Select
                  value={filtroMunicipio}
                  label="Município"
                  onChange={(e) => setFiltroMunicipio(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {municipios.map((mun) => (
                    <MenuItem key={mun} value={mun}>{mun}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setFiltroCliente('');
                  setFiltroMunicipio('todos');
                  setActiveTab(0);
                }}
              >
                Limpar
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

      {/* Tabela de notas */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Cliente (Prestador)</TableCell>
                <TableCell>Tomador</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>ISS</TableCell>
                <TableCell>Data Emissão</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((nota) => {
                  const statusConfig = getStatusConfig(nota.status);
                  return (
                    <TableRow key={nota.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            #{nota.numero}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Série: {nota.serie}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2">{nota.clienteNome}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {nota.clienteCnpj}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{nota.tomadorNome}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {nota.tomadorDocumento}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(nota.valor)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatCurrency(nota.valorIss)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {nota.aliquotaIss}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(nota.dataEmissao), 'dd/MM/yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(nota.dataEmissao), 'HH:mm')}
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
                        <IconButton onClick={(e) => handleMenuOpen(e, nota)}>
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
          count={filteredNotas.length}
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
          <ListItemIcon><PictureAsPdf fontSize="small" /></ListItemIcon>
          Baixar PDF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Description fontSize="small" /></ListItemIcon>
          Baixar XML
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Print fontSize="small" /></ListItemIcon>
          Imprimir
        </MenuItem>
        {selectedNota?.status === 'emitida' && (
          <>
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon><Cancel fontSize="small" color="error" /></ListItemIcon>
              Cancelar nota
            </MenuItem>
          </>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light' }}>
                <Receipt />
              </Avatar>
              <Box>
                <Typography variant="h6">NFS-e #{selectedNota?.numero}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Série {selectedNota?.serie} • {selectedNota?.municipio}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={getStatusConfig(selectedNota?.status || '').icon}
                label={getStatusConfig(selectedNota?.status || '').label}
                size="small"
                color={getStatusConfig(selectedNota?.status || '').color}
              />
              <IconButton onClick={() => setDetalhesDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Prestador (Cliente)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>{selectedNota?.clienteNome}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedNota?.clienteCnpj}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tomador
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>{selectedNota?.tomadorNome}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedNota?.tomadorDocumento}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Descrição do Serviço
                </Typography>
                <Typography variant="body2">{selectedNota?.descricaoServico}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Valores
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Valor do Serviço:</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatCurrency(selectedNota?.valor || 0)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Alíquota ISS:</Typography>
                    <Typography variant="body2">{selectedNota?.aliquotaIss}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Valor ISS:</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatCurrency(selectedNota?.valorIss || 0)}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Informações Adicionais
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Data Emissão:</Typography>
                    <Typography variant="body2">
                      {selectedNota?.dataEmissao && format(new Date(selectedNota.dataEmissao), "dd/MM/yyyy 'às' HH:mm")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Código Verificação:</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedNota?.codigoVerificacao || '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Município:</Typography>
                    <Typography variant="body2">{selectedNota?.municipio}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            {selectedNota?.status === 'cancelada' && selectedNota?.motivoCancelamento && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.50' }}>
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Motivo do Cancelamento
                  </Typography>
                  <Typography variant="body2">{selectedNota.motivoCancelamento}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalhesDialogOpen(false)}>
            Fechar
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
          >
            Baixar PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Description />}
          >
            Baixar XML
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotasFiscaisPage;
