import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  Alert,
  Badge,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  MoreVert,
  CloudUpload,
  Warning,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
  CalendarToday,
  Close,
  AttachFile,
  UploadFile,
} from '@mui/icons-material';
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Guia, GuiaStatus, TipoGuia } from '../../../types';

// Mock data
const mockGuias: Guia[] = [
  {
    id: '1',
    tipo: 'DAS',
    descricao: 'DAS - Simples Nacional - Competência 11/2024',
    competencia: '11/2024',
    dataVencimento: '2024-12-20',
    valor: 285.60,
    status: 'pendente',
    codigoBarras: '23793.38128 60000.000000 00000.000102 9 95890000028560',
    createdAt: '2024-12-01T10:00:00',
  },
  {
    id: '2',
    tipo: 'ISS',
    descricao: 'ISS - Imposto sobre Serviços - Competência 11/2024',
    competencia: '11/2024',
    dataVencimento: '2024-12-10',
    valor: 225.00,
    status: 'paga',
    dataPagamento: '2024-12-09',
    comprovanteUrl: '/path/to/comprovante.pdf',
    codigoBarras: '23793.38128 60000.000000 00000.000103 8 95890000022500',
    createdAt: '2024-12-01T10:00:00',
  },
  {
    id: '3',
    tipo: 'INSS',
    descricao: 'INSS Patronal - Competência 11/2024',
    competencia: '11/2024',
    dataVencimento: '2024-12-15',
    valor: 1320.00,
    status: 'pendente',
    codigoBarras: '85830000013 2 20000000000 5 00000000000 3 00000000000 8',
    createdAt: '2024-12-01T10:00:00',
  },
  {
    id: '4',
    tipo: 'IRPJ',
    descricao: 'IRPJ - Imposto de Renda Pessoa Jurídica - Competência 10/2024',
    competencia: '10/2024',
    dataVencimento: '2024-11-30',
    valor: 450.00,
    status: 'vencida',
    codigoBarras: '10499.99850 20000.000000 00000.000104 7 95580000045000',
    createdAt: '2024-11-01T10:00:00',
  },
  {
    id: '5',
    tipo: 'CSLL',
    descricao: 'CSLL - Contribuição Social sobre Lucro Líquido - Competência 10/2024',
    competencia: '10/2024',
    dataVencimento: '2024-11-30',
    valor: 180.00,
    status: 'paga',
    dataPagamento: '2024-11-28',
    codigoBarras: '10499.99850 20000.000000 00000.000105 6 95580000018000',
    createdAt: '2024-11-01T10:00:00',
  },
  {
    id: '6',
    tipo: 'DAS',
    descricao: 'DAS - Simples Nacional - Competência 12/2024',
    competencia: '12/2024',
    dataVencimento: '2025-01-20',
    valor: 310.25,
    status: 'pendente',
    codigoBarras: '23793.38128 60000.000000 00000.000106 5 96890000031025',
    createdAt: '2024-12-10T10:00:00',
  },
];

const statusConfig: Record<GuiaStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; icon: React.ReactElement }> = {
  pendente: { label: 'Pendente', color: 'warning', icon: <Schedule fontSize="small" /> },
  paga: { label: 'Paga', color: 'success', icon: <CheckCircle fontSize="small" /> },
  vencida: { label: 'Vencida', color: 'error', icon: <ErrorIcon fontSize="small" /> },
  parcelada: { label: 'Parcelada', color: 'info', icon: <Schedule fontSize="small" /> },
  cancelada: { label: 'Cancelada', color: 'default', icon: <Close fontSize="small" /> },
};

const tipoConfig: Record<TipoGuia, { label: string; color: string }> = {
  DAS: { label: 'DAS - Simples Nacional', color: '#2563eb' },
  ISS: { label: 'ISS - Imposto sobre Serviços', color: '#059669' },
  INSS: { label: 'INSS - Previdência Social', color: '#d97706' },
  IRPJ: { label: 'IRPJ - Imposto de Renda PJ', color: '#7c3aed' },
  CSLL: { label: 'CSLL - Contribuição Social', color: '#db2777' },
  'PIS/COFINS': { label: 'PIS/COFINS - Contribuições', color: '#0891b2' },
  FGTS: { label: 'FGTS - Fundo de Garantia', color: '#ea580c' },
  obrigacao_acessoria: { label: 'Obrigação Acessória', color: '#6b7280' },
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const GuiasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGuia, setSelectedGuia] = useState<Guia | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const tabs = [
    { label: 'Todas', count: mockGuias.length },
    { label: 'Pendentes', count: mockGuias.filter(g => g.status === 'pendente').length },
    { label: 'Pagas', count: mockGuias.filter(g => g.status === 'paga').length },
    { label: 'Vencidas', count: mockGuias.filter(g => g.status === 'vencida').length },
  ];

  const filteredGuias = mockGuias.filter(guia => {
    const matchesSearch =
      guia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.competencia.includes(searchTerm);
    
    let matchesTab = true;
    if (activeTab === 1) matchesTab = guia.status === 'pendente';
    if (activeTab === 2) matchesTab = guia.status === 'paga';
    if (activeTab === 3) matchesTab = guia.status === 'vencida';
    
    return matchesSearch && matchesTab;
  });

  // Calculate totals
  const totalPendente = mockGuias
    .filter(g => g.status === 'pendente')
    .reduce((sum, g) => sum + g.valor, 0);
  
  const totalVencido = mockGuias
    .filter(g => g.status === 'vencida')
    .reduce((sum, g) => sum + g.valor, 0);

  const proximasVencer = mockGuias
    .filter(g => {
      if (g.status !== 'pendente') return false;
      const vencimento = parseISO(g.dataVencimento);
      const limite = addDays(new Date(), 7);
      return vencimento <= limite;
    }).length;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, guia: Guia) => {
    setAnchorEl(event.currentTarget);
    setSelectedGuia(guia);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGuia(null);
  };

  const handleUploadClick = (guia: Guia) => {
    setSelectedGuia(guia);
    setUploadDialogOpen(true);
    handleMenuClose();
  };

  const getDaysUntilDue = (dateStr: string): number => {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Guias de Impostos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Controle de pagamentos e obrigaÃ§Ãµes fiscais
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<CalendarToday />}>
            CalendÃ¡rio
          </Button>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filtrar
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {totalVencido > 0 && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<Warning />}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            VocÃª tem guias vencidas totalizando {formatCurrency(totalVencido)}. Regularize para evitar multas e juros.
          </Typography>
        </Alert>
      )}
      
      {proximasVencer > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            {proximasVencer} guia(s) com vencimento nos prÃ³ximos 7 dias.
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {formatCurrency(totalPendente)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Pendente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {formatCurrency(totalVencido)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Vencido
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={proximasVencer} color="warning">
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {mockGuias.filter(g => g.status === 'pendente').length}
                </Typography>
              </Badge>
              <Typography variant="body2" color="text.secondary">
                Guias Pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {mockGuias.filter(g => g.status === 'paga').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pagas este mÃªs
              </Typography>
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
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar por tipo, competÃªncia..."
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
              sx={{ width: 320 }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>CompetÃªncia</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">AÃ§Ãµes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGuias
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((guia) => {
                    const daysUntil = getDaysUntilDue(guia.dataVencimento);
                    const isUrgent = guia.status === 'pendente' && daysUntil <= 3 && daysUntil >= 0;
                    
                    return (
                      <TableRow key={guia.id} hover sx={isUrgent ? { bgcolor: 'error.50' } : undefined}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 4,
                                height: 36,
                                borderRadius: 1,
                                bgcolor: tipoConfig[guia.tipo]?.color || 'grey.400',
                              }}
                            />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {guia.tipo}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {tipoConfig[guia.tipo]?.label.split(' - ')[1] || guia.tipo}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {guia.competencia}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {format(parseISO(guia.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
                          </Typography>
                          {guia.status === 'pendente' && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: daysUntil <= 3 ? 'error.main' : daysUntil <= 7 ? 'warning.main' : 'text.secondary',
                                fontWeight: daysUntil <= 3 ? 600 : 400,
                              }}
                            >
                              {daysUntil === 0
                                ? 'Vence hoje!'
                                : daysUntil === 1
                                ? 'Vence amanhÃ£'
                                : daysUntil > 0
                                ? `Em ${daysUntil} dias`
                                : `${Math.abs(daysUntil)} dias atrÃ¡s`}
                            </Typography>
                          )}
                          {guia.status === 'paga' && guia.dataPagamento && (
                            <Typography variant="caption" color="success.main">
                              Pago em {format(parseISO(guia.dataPagamento), "dd/MM", { locale: ptBR })}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(guia.valor)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusConfig[guia.status].icon}
                            label={statusConfig[guia.status].label}
                            color={statusConfig[guia.status].color}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download Guia">
                            <IconButton size="small">
                              <Download fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {guia.status === 'pendente' && (
                            <Tooltip title="Enviar Comprovante">
                              <IconButton size="small" onClick={() => handleUploadClick(guia)}>
                                <CloudUpload fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, guia)}>
                            <MoreVert fontSize="small" />
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
            labelRowsPerPage="Itens por pÃ¡gina"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Download fontSize="small" /></ListItemIcon>
          Download PDF
        </MenuItem>
        {selectedGuia?.status === 'pendente' && (
          <MenuItem onClick={() => selectedGuia && handleUploadClick(selectedGuia)}>
            <ListItemIcon><CloudUpload fontSize="small" /></ListItemIcon>
            Enviar Comprovante
          </MenuItem>
        )}
        {selectedGuia?.status === 'paga' && selectedGuia.comprovanteUrl && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><AttachFile fontSize="small" /></ListItemIcon>
            Ver Comprovante
          </MenuItem>
        )}
      </Menu>

      {/* Upload Comprovante Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUpload color="primary" />
              Enviar Comprovante de Pagamento
            </Box>
            <IconButton onClick={() => setUploadDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedGuia && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {tipoConfig[selectedGuia.tipo]?.label || selectedGuia.tipo}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatCurrency(selectedGuia.valor)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vencimento: {format(parseISO(selectedGuia.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
              </Typography>
            </Box>
          )}
          
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
            onClick={() => document.getElementById('comprovante-upload')?.click()}
          >
            <input
              id="comprovante-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            {selectedFile ? (
              <Box>
                <UploadFile sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Arraste o comprovante ou clique para selecionar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF, JPG ou PNG atÃ© 5MB
                </Typography>
              </Box>
            )}
          </Box>
          
          <TextField
            fullWidth
            label="Data do Pagamento"
            type="date"
            defaultValue={format(new Date(), 'yyyy-MM-dd')}
            sx={{ mt: 3 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" disabled={!selectedFile}>
            Enviar Comprovante
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GuiasPage;
