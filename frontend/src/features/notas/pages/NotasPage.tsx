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
  Tabs,
  Tab,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Download,
  Visibility,
  MoreVert,
  Receipt,
  Send,
  Save,
  ContentCopy,
  Cancel,
  Close,
  CheckCircle,
  Error as ErrorIcon,
  AccessTime,
  Description,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { NotaFiscal, NotaFiscalStatus, Tomador } from '../../../types';

// Mock data
const mockNotas: NotaFiscal[] = [
  {
    id: '1',
    numero: 1023,
    serie: '1',
    tipo: 'nfse',
    status: 'emitida',
    tomador: {
      id: '1',
      tipo: 'pj',
      documento: '12345678000190',
      razaoSocial: 'Tech Solutions LTDA',
      endereco: { cep: '01310100', logradouro: 'Av Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
      email: 'contato@techsolutions.com.br',
      ativo: true,
      totalNotas: 15,
      faturamentoTotal: 67500,
      createdAt: '2024-01-01',
      updatedAt: '2024-12-01',
    },
    servico: { descricao: 'Desenvolvimento de Software', cnae: '6201501', codigoTributacaoMunicipal: '1.01' },
    valores: { valorServico: 4500, baseCalculo: 4500, valorLiquido: 4275 },
    tributos: { iss: { aliquota: 5, valor: 225, retido: false, exigibilidade: 'normal' } },
    dataEmissao: '2024-12-10',
    dataCompetencia: '12/2024',
    localPrestacao: { municipio: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
    protocoloPrefeitura: 'SP2024121000001',
    codigoVerificacao: 'ABC123DEF',
    createdAt: '2024-12-10T10:30:00',
    updatedAt: '2024-12-10T10:30:00',
  },
  {
    id: '2',
    numero: 1022,
    serie: '1',
    tipo: 'nfse',
    status: 'emitida',
    tomador: {
      id: '2',
      tipo: 'pj',
      documento: '98765432000110',
      razaoSocial: 'Consultoria Alpha S.A',
      endereco: { cep: '04543011', logradouro: 'Av Faria Lima', numero: '2000', bairro: 'Itaim Bibi', cidade: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
      email: 'contato@alpha.com.br',
      ativo: true,
      totalNotas: 8,
      faturamentoTotal: 32000,
      createdAt: '2024-03-01',
      updatedAt: '2024-12-01',
    },
    servico: { descricao: 'Consultoria em TI', cnae: '6204000', codigoTributacaoMunicipal: '1.05' },
    valores: { valorServico: 2000, baseCalculo: 2000, valorLiquido: 1900 },
    tributos: { iss: { aliquota: 5, valor: 100, retido: false, exigibilidade: 'normal' } },
    dataEmissao: '2024-12-08',
    dataCompetencia: '12/2024',
    localPrestacao: { municipio: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
    protocoloPrefeitura: 'SP2024120800002',
    codigoVerificacao: 'XYZ789ABC',
    createdAt: '2024-12-08T14:20:00',
    updatedAt: '2024-12-08T14:20:00',
  },
  {
    id: '3',
    serie: '1',
    tipo: 'nfse',
    status: 'rascunho',
    tomador: {
      id: '3',
      tipo: 'pf',
      documento: '12345678901',
      nome: 'JoÃ£o Silva',
      endereco: { cep: '01310100', logradouro: 'Rua Augusta', numero: '500', bairro: 'ConsolaÃ§Ã£o', cidade: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
      email: 'joao@email.com',
      ativo: true,
      totalNotas: 3,
      faturamentoTotal: 2550,
      createdAt: '2024-06-01',
      updatedAt: '2024-12-01',
    },
    servico: { descricao: 'ManutenÃ§Ã£o de Website', cnae: '6201501', codigoTributacaoMunicipal: '1.01' },
    valores: { valorServico: 850, baseCalculo: 850, valorLiquido: 850 },
    tributos: { iss: { aliquota: 5, valor: 42.5, retido: true, exigibilidade: 'normal' } },
    dataCompetencia: '12/2024',
    localPrestacao: { municipio: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
    createdAt: '2024-12-05T09:15:00',
    updatedAt: '2024-12-05T09:15:00',
  },
  {
    id: '4',
    numero: 1020,
    serie: '1',
    tipo: 'nfse',
    status: 'cancelada',
    tomador: {
      id: '4',
      tipo: 'pj',
      documento: '55566677000188',
      razaoSocial: 'Startup Digital ME',
      endereco: { cep: '04547004', logradouro: 'Rua Funchal', numero: '418', bairro: 'Vila OlÃ­mpia', cidade: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
      email: 'contato@startup.com.br',
      ativo: true,
      totalNotas: 5,
      faturamentoTotal: 12500,
      createdAt: '2024-05-01',
      updatedAt: '2024-12-01',
    },
    servico: { descricao: 'Desenvolvimento de App', cnae: '6201501', codigoTributacaoMunicipal: '1.01' },
    valores: { valorServico: 3200, baseCalculo: 3200, valorLiquido: 3040 },
    tributos: { iss: { aliquota: 5, valor: 160, retido: false, exigibilidade: 'normal' } },
    dataEmissao: '2024-12-01',
    dataCompetencia: '12/2024',
    localPrestacao: { municipio: 'SÃ£o Paulo', uf: 'SP', codigoMunicipio: '3550308' },
    protocoloPrefeitura: 'SP2024120100004',
    createdAt: '2024-12-01T11:30:00',
    updatedAt: '2024-12-02T16:00:00',
  },
];

const statusConfig: Record<NotaFiscalStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; icon: React.ReactElement }> = {
  rascunho: { label: 'Rascunho', color: 'default', icon: <Description fontSize="small" /> },
  simulada: { label: 'Simulada', color: 'info', icon: <Visibility fontSize="small" /> },
  processando: { label: 'Processando', color: 'warning', icon: <AccessTime fontSize="small" /> },
  emitida: { label: 'Emitida', color: 'success', icon: <CheckCircle fontSize="small" /> },
  cancelada: { label: 'Cancelada', color: 'error', icon: <Cancel fontSize="small" /> },
  erro: { label: 'Erro', color: 'error', icon: <ErrorIcon fontSize="small" /> },
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Mock Tomadores for autocomplete
const mockTomadores: Partial<Tomador>[] = [
  { id: '1', tipo: 'pj', documento: '12345678000190', razaoSocial: 'Tech Solutions LTDA' },
  { id: '2', tipo: 'pj', documento: '98765432000110', razaoSocial: 'Consultoria Alpha S.A' },
  { id: '3', tipo: 'pf', documento: '12345678901', nome: 'JoÃ£o Silva' },
];

const NotasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null);
  const [emitirDialogOpen, setEmitirDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const tabs = [
    { label: 'Todas', count: mockNotas.length },
    { label: 'Emitidas', count: mockNotas.filter(n => n.status === 'emitida').length },
    { label: 'Rascunhos', count: mockNotas.filter(n => n.status === 'rascunho').length },
    { label: 'Canceladas', count: mockNotas.filter(n => n.status === 'cancelada').length },
  ];

  const filteredNotas = mockNotas.filter(nota => {
    const matchesSearch =
      nota.tomador.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.tomador.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.numero?.toString().includes(searchTerm);
    
    let matchesTab = true;
    if (activeTab === 1) matchesTab = nota.status === 'emitida';
    if (activeTab === 2) matchesTab = nota.status === 'rascunho';
    if (activeTab === 3) matchesTab = nota.status === 'cancelada';
    
    return matchesSearch && matchesTab;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, nota: NotaFiscal) => {
    setAnchorEl(event.currentTarget);
    setSelectedNota(nota);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNota(null);
  };

  const steps = ['Tomador', 'ServiÃ§o', 'RevisÃ£o'];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Notas Fiscais
          </Typography>
          <Typography variant="body2" color="text.secondary">
            EmissÃ£o e gestÃ£o de NFS-e
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
          >
            Filtrar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setEmitirDialogOpen(true)}
          >
            Emitir Nota
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {mockNotas.filter(n => n.status === 'emitida').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emitidas este mÃªs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(mockNotas.filter(n => n.status === 'emitida').reduce((sum, n) => sum + n.valores.valorServico, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faturamento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {mockNotas.filter(n => n.status === 'rascunho').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rascunhos pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {formatCurrency(mockNotas.filter(n => n.status === 'emitida').reduce((sum, n) => sum + n.tributos.iss.valor, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ISS do perÃ­odo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Card */}
      <Card>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
          >
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
              placeholder="Buscar por nÃºmero, tomador..."
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
                  <TableCell>NÃºmero</TableCell>
                  <TableCell>Tomador</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Data EmissÃ£o</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">AÃ§Ãµes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNotas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((nota) => (
                    <TableRow key={nota.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {nota.numero ? `#${nota.numero}` : 'Sem nÃºmero'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SÃ©rie {nota.serie}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {nota.tomador.razaoSocial || nota.tomador.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {nota.tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}: {nota.tomador.documento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(nota.valores.valorServico)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ISS: {formatCurrency(nota.tributos.iss.valor)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {nota.dataEmissao ? (
                          <>
                            <Typography variant="body2">
                              {format(parseISO(nota.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Comp: {nota.dataCompetencia}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            NÃ£o emitida
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusConfig[nota.status].icon}
                          label={statusConfig[nota.status].label}
                          color={statusConfig[nota.status].color}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualizar">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {nota.status === 'emitida' && (
                          <Tooltip title="Download">
                            <IconButton size="small">
                              <Download fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, nota)}>
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
            count={filteredNotas.length}
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
        {selectedNota?.status === 'emitida' && (
          <>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Download fontSize="small" /></ListItemIcon>
              Download PDF
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Download fontSize="small" /></ListItemIcon>
              Download XML
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Send fontSize="small" /></ListItemIcon>
              Enviar por email
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon><Cancel fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
              Cancelar nota
            </MenuItem>
          </>
        )}
        {selectedNota?.status === 'rascunho' && (
          <>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Send fontSize="small" /></ListItemIcon>
              Emitir nota
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
              Duplicar
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Emitir Nota Dialog */}
      <Dialog
        open={emitirDialogOpen}
        onClose={() => setEmitirDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt color="primary" />
              Emitir Nota Fiscal
            </Box>
            <IconButton onClick={() => setEmitirDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Selecione o Tomador
              </Typography>
              <Autocomplete
                options={mockTomadores}
                getOptionLabel={(option) => option.razaoSocial || option.nome || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar tomador"
                    placeholder="Digite CNPJ/CPF ou nome"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.razaoSocial || option.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.tipo === 'pj' ? 'CNPJ' : 'CPF'}: {option.documento}
                      </Typography>
                    </Box>
                  </li>
                )}
                sx={{ mb: 2 }}
              />
              <Button variant="text" startIcon={<Add />}>
                Cadastrar novo tomador
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Dados do ServiÃ§o
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="DescriÃ§Ã£o do ServiÃ§o"
                    multiline
                    rows={3}
                    placeholder="Descreva o serviÃ§o prestado..."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Valor do ServiÃ§o" placeholder="R$ 0,00" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CNAE" placeholder="Ex: 6201-5/01" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CÃ³digo TributaÃ§Ã£o Municipal" placeholder="Ex: 1.01" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CompetÃªncia" defaultValue="12/2024" />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Revise os dados antes de emitir. ApÃ³s a emissÃ£o, a nota sÃ³ poderÃ¡ ser cancelada dentro do prazo legal.
              </Alert>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tomador
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Tech Solutions LTDA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CNPJ: 12.345.678/0001-90
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  ServiÃ§o
                </Typography>
                <Typography variant="body2">
                  Desenvolvimento de Software
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Valor do Serviço</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>R$ 4.500,00</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">ISS (5%)</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>R$ 225,00</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Voltar
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep < steps.length - 1 && (
                <Button variant="outlined" startIcon={<Save />}>
                  Salvar Rascunho
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => setEmitirDialogOpen(false)}
                >
                  Emitir Nota
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setActiveStep((prev) => prev + 1)}
                >
                  PrÃ³ximo
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NotasPage;
