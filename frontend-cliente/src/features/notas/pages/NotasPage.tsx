import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Snackbar,
  Checkbox,
  Badge,
  CircularProgress,
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
  FileDownload,
  Business,
  LocationOn,
  Email,
  Print,
  Edit,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { NotaFiscal, NotaFiscalStatus, Tomador } from '../../../types';
import notasService from '../../../services/notasService';
import tomadoresService from '../../../services/tomadoresService';
import { useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';
import CancelarNotaDialog from '../components/CancelarNotaDialog';
import FiltrosAvancadosDrawer, { filtrosIniciais, type FiltrosNotas } from '../components/FiltrosAvancadosDrawer';
import ExportarNotasDialog from '../components/ExportarNotasDialog';

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

const NotasPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { company } = useAppSelector((state: RootState) => state.auth);
  
  // Estados para dados da API
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [tomadores, setTomadores] = useState<Tomador[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ todas: 0, emitidas: 0, rascunhos: 0, canceladas: 0 });
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null);
  const [emitirDialogOpen, setEmitirDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Buscar notas da API
  const fetchNotas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const statusMap: Record<number, NotaFiscalStatus | undefined> = {
        0: undefined,
        1: 'emitida',
        2: 'rascunho',
        3: 'cancelada',
      };
      
      const response = await notasService.findAll({
        empresaId: company?.id,
        status: statusMap[activeTab],
        busca: searchTerm || undefined,
        page: page + 1,
        limit: rowsPerPage,
      });
      
      setNotas(response.items || []);
      setTotalCount(response.meta?.total || 0);
      
      // Buscar contagem por status (todas as abas)
      const [allNotas, emitidasRes, rascunhosRes, canceladasRes] = await Promise.all([
        notasService.findAll({ empresaId: company?.id, limit: 1 }),
        notasService.findAll({ empresaId: company?.id, status: 'emitida', limit: 1 }),
        notasService.findAll({ empresaId: company?.id, status: 'rascunho', limit: 1 }),
        notasService.findAll({ empresaId: company?.id, status: 'cancelada', limit: 1 }),
      ]);
      
      setStats({
        todas: allNotas.meta?.total || 0,
        emitidas: emitidasRes.meta?.total || 0,
        rascunhos: rascunhosRes.meta?.total || 0,
        canceladas: canceladasRes.meta?.total || 0,
      });
    } catch (err: any) {
      console.error('Erro ao carregar notas:', err);
      setError(err.response?.data?.message || 'Erro ao carregar notas fiscais');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, activeTab, searchTerm, page, rowsPerPage]);

  // Buscar tomadores para autocomplete
  const fetchTomadores = useCallback(async () => {
    try {
      const response = await tomadoresService.findAll({
        empresaId: company?.id,
        ativo: true,
        limit: 50,
      });
      setTomadores(response.items || []);
    } catch (err) {
      console.error('Erro ao carregar tomadores:', err);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  useEffect(() => {
    fetchTomadores();
  }, [fetchTomadores]);

  // Sincronizar aba com query param
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'rascunhos') {
      setActiveTab(2);
    } else if (tabParam === 'emitidas') {
      setActiveTab(1);
    } else if (tabParam === 'canceladas') {
      setActiveTab(3);
    }
  }, [searchParams]);

  // Atualizar URL quando mudar a aba
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(0);
    const tabNames = ['', 'emitidas', 'rascunhos', 'canceladas'];
    if (newValue === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabNames[newValue] });
    }
  };
  const [cancelarDialogOpen, setCancelarDialogOpen] = useState(false);
  const [notaParaCancelar, setNotaParaCancelar] = useState<NotaFiscal | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Novos estados para filtros e exportação
  const [filtrosDrawerOpen, setFiltrosDrawerOpen] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosNotas>(filtrosIniciais);
  const [exportarDialogOpen, setExportarDialogOpen] = useState(false);
  const [notasSelecionadas, setNotasSelecionadas] = useState<string[]>([]);
  const [visualizarDialogOpen, setVisualizarDialogOpen] = useState(false);
  const [notaParaVisualizar, setNotaParaVisualizar] = useState<NotaFiscal | null>(null);

  const tabs = [
    { label: 'Todas', count: stats.todas },
    { label: 'Emitidas', count: stats.emitidas },
    { label: 'Rascunhos', count: stats.rascunhos },
    { label: 'Canceladas', count: stats.canceladas },
  ];

  // Notas já filtradas pela API
  const filteredNotas = notas;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, nota: NotaFiscal) => {
    setAnchorEl(event.currentTarget);
    setSelectedNota(nota);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVisualizarNota = (nota: NotaFiscal) => {
    setNotaParaVisualizar(nota);
    setVisualizarDialogOpen(true);
    handleMenuClose();
  };

  const handleCancelarNota = () => {
    handleMenuClose();
    if (selectedNota) {
      setNotaParaCancelar(selectedNota);
      setCancelarDialogOpen(true);
    }
  };

  // Função para download de PDF
  const handleDownloadPdf = async (nota: NotaFiscal) => {
    try {
      const blob = await notasService.downloadPdf(nota.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nota-${nota.numero || nota.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSnackbar({
        open: true,
        message: 'Download do PDF iniciado!',
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao baixar PDF',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  // Função para download de XML
  const handleDownloadXml = async (nota: NotaFiscal) => {
    try {
      const blob = await notasService.downloadXml(nota.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nota-${nota.numero || nota.id}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSnackbar({
        open: true,
        message: 'Download do XML iniciado!',
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao baixar XML',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  // Função para emitir nota (rascunho)
  const handleEmitirNota = async (nota: NotaFiscal) => {
    if (nota.status !== 'rascunho') return;
    try {
      await notasService.emitir(nota.id);
      setSnackbar({
        open: true,
        message: 'Nota fiscal emitida com sucesso!',
        severity: 'success'
      });
      fetchNotas();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao emitir nota fiscal',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  // Função para duplicar nota
  const handleDuplicarNota = (nota: NotaFiscal) => {
    navigate(`/notas/emitir?duplicar=${nota.id}`);
    handleMenuClose();
  };

  const handleConfirmarCancelamento = async (notaId: string, justificativa: string) => {
    try {
      await notasService.cancelar(notaId, { motivo: justificativa });
      setSnackbar({
        open: true,
        message: 'Nota fiscal cancelada com sucesso!',
        severity: 'success'
      });
      fetchNotas(); // Recarrega as notas
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao cancelar nota fiscal',
        severity: 'error'
      });
    }
  };

  // Funções para filtros
  const handleAplicarFiltros = (novosFiltros: FiltrosNotas) => {
    setFiltros(novosFiltros);
    setPage(0);
  };

  const handleLimparFiltros = () => {
    setFiltros(filtrosIniciais);
    setPage(0);
  };

  const contarFiltrosAtivos = () => {
    let count = 0;
    if (filtros.dataInicio) count++;
    if (filtros.dataFim) count++;
    if (filtros.competencia) count++;
    if (filtros.status.length > 0) count++;
    if (filtros.tomadorId) count++;
    if (filtros.valorMinimo || filtros.valorMaximo) count++;
    if (filtros.numeroInicio || filtros.numeroFim) count++;
    if (filtros.cnaeList.length > 0) count++;
    if (filtros.comRetencao !== null) count++;
    if (filtros.municipioPrestacao) count++;
    return count;
  };

  // Funções para seleção
  const handleSelectNota = (notaId: string) => {
    setNotasSelecionadas(prev =>
      prev.includes(notaId)
        ? prev.filter(id => id !== notaId)
        : [...prev, notaId]
    );
  };

  const handleSelectAll = () => {
    if (notasSelecionadas.length === filteredNotas.length) {
      setNotasSelecionadas([]);
    } else {
      setNotasSelecionadas(filteredNotas.map(n => n.id));
    }
  };

  const steps = ['Tomador', 'Serviço', 'Revisão'];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Notas Fiscais
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Emissão e gestão de NFS-e
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={() => setExportarDialogOpen(true)}
          >
            Exportar
          </Button>
          <Badge badgeContent={contarFiltrosAtivos()} color="primary">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFiltrosDrawerOpen(true)}
            >
              Filtrar
            </Button>
          </Badge>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/notas/emitir?simulacao=true')}
          >
            Simular
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/notas/emitir')}
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
                {stats.emitidas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emitidas este mês
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(notas.filter(n => n.status === 'emitida').reduce((sum, n) => sum + (n.valores?.valorServico || 0), 0))}
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
                {stats.rascunhos}
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
                {formatCurrency(notas.filter(n => n.status === 'emitida').reduce((sum, n) => sum + (n.tributos?.iss?.valor || 0), 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ISS do período
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
            onChange={handleTabChange}
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
          {/* Search Bar + Selection Info */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              placeholder="Buscar por número, tomador..."
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
            {notasSelecionadas.length > 0 && (
              <Chip
                label={`${notasSelecionadas.length} selecionada(s)`}
                color="primary"
                onDelete={() => setNotasSelecionadas([])}
              />
            )}
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={notasSelecionadas.length > 0 && notasSelecionadas.length < filteredNotas.length}
                      checked={filteredNotas.length > 0 && notasSelecionadas.length === filteredNotas.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Número</TableCell>
                  <TableCell>Tomador</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Data Emissão</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNotas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((nota) => (
                    <TableRow 
                      key={nota.id} 
                      hover
                      selected={notasSelecionadas.includes(nota.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={notasSelecionadas.includes(nota.id)}
                          onChange={() => handleSelectNota(nota.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {nota.numero ? `#${nota.numero}` : 'Sem número'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Série {nota.serie}
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
                            Não emitida
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
                          <IconButton size="small" onClick={() => handleVisualizarNota(nota)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {nota.status === 'emitida' && (
                          <Tooltip title="Download PDF">
                            <IconButton size="small" onClick={() => handleDownloadPdf(nota)}>
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
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => selectedNota && handleVisualizarNota(selectedNota)}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Visualizar
        </MenuItem>
        {selectedNota?.status === 'emitida' && (
          <>
            <MenuItem onClick={() => selectedNota && handleDownloadPdf(selectedNota)}>
              <ListItemIcon><Download fontSize="small" /></ListItemIcon>
              Download PDF
            </MenuItem>
            <MenuItem onClick={() => selectedNota && handleDownloadXml(selectedNota)}>
              <ListItemIcon><Download fontSize="small" /></ListItemIcon>
              Download XML
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Send fontSize="small" /></ListItemIcon>
              Enviar por email
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCancelarNota} sx={{ color: 'error.main' }}>
              <ListItemIcon><Cancel fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
              Cancelar nota
            </MenuItem>
          </>
        )}
        {selectedNota?.status === 'rascunho' && (
          <>
            <MenuItem onClick={() => selectedNota && handleEmitirNota(selectedNota)}>
              <ListItemIcon><Send fontSize="small" /></ListItemIcon>
              Emitir nota
            </MenuItem>
            <MenuItem onClick={() => selectedNota && handleDuplicarNota(selectedNota)}>
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
                options={tomadores}
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
                Dados do Serviço
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição do Serviço"
                    multiline
                    rows={3}
                    placeholder="Descreva o Serviço prestado..."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Valor do Serviço" placeholder="R$ 0,00" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="CNAE" placeholder="Ex: 6201-5/01" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Código Tributação Municipal" placeholder="Ex: 1.01" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Competência" defaultValue="12/2024" />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Revise os dados antes de emitir. Após a Emissão, a nota só poderá¡ ser cancelada dentro do prazo legal.
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
                  Serviço
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
                  Próximo
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog de Cancelamento */}
      <CancelarNotaDialog
        open={cancelarDialogOpen}
        onClose={() => {
          setCancelarDialogOpen(false);
          setNotaParaCancelar(null);
        }}
        nota={notaParaCancelar}
        onConfirm={handleConfirmarCancelamento}
      />

      {/* Drawer de Filtros Avançados */}
      <FiltrosAvancadosDrawer
        open={filtrosDrawerOpen}
        onClose={() => setFiltrosDrawerOpen(false)}
        filtros={filtros}
        onAplicar={handleAplicarFiltros}
        onLimpar={handleLimparFiltros}
      />

      {/* Dialog de Exportação */}
      <ExportarNotasDialog
        open={exportarDialogOpen}
        onClose={() => setExportarDialogOpen(false)}
        totalNotas={filteredNotas.length}
        notasSelecionadas={notasSelecionadas.length}
      />

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog de Visualização de Nota */}
      <Dialog
        open={visualizarDialogOpen}
        onClose={() => setVisualizarDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt color="primary" />
              <Box>
                <Typography variant="h6" component="span">
                  {notaParaVisualizar?.numero 
                    ? `Nota Fiscal #${notaParaVisualizar.numero}` 
                    : 'Rascunho de Nota Fiscal'}
                </Typography>
                {notaParaVisualizar && (
                  <Chip
                    label={statusConfig[notaParaVisualizar.status].label}
                    color={statusConfig[notaParaVisualizar.status].color}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {notaParaVisualizar?.status === 'emitida' && (
                <>
                  <Tooltip title="Download PDF">
                    <IconButton size="small" onClick={() => notaParaVisualizar && handleDownloadPdf(notaParaVisualizar)}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Imprimir">
                    <IconButton size="small" onClick={() => window.print()}>
                      <Print />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <IconButton onClick={() => setVisualizarDialogOpen(false)} size="small">
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {notaParaVisualizar && (
            <Grid container spacing={3}>
              {/* Informações Gerais */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Número / Série
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {notaParaVisualizar.numero ? `${notaParaVisualizar.numero} / ${notaParaVisualizar.serie}` : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Data de Emissão
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {notaParaVisualizar.dataEmissao 
                          ? format(parseISO(notaParaVisualizar.dataEmissao), "dd/MM/yyyy", { locale: ptBR })
                          : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Competência
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {notaParaVisualizar.dataCompetencia}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Código de Verificação
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {notaParaVisualizar.codigoVerificacao || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Tomador */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Business color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Tomador do Serviço
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {notaParaVisualizar.tomador.razaoSocial || notaParaVisualizar.tomador.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {notaParaVisualizar.tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}: {notaParaVisualizar.tomador.documento}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">
                      {notaParaVisualizar.tomador.endereco?.logradouro}, {notaParaVisualizar.tomador.endereco?.numero}
                      <br />
                      {notaParaVisualizar.tomador.endereco?.bairro} - {notaParaVisualizar.tomador.endereco?.cidade}/{notaParaVisualizar.tomador.endereco?.uf}
                      <br />
                      CEP: {notaParaVisualizar.tomador.endereco?.cep}
                    </Typography>
                  </Box>
                  {notaParaVisualizar.tomador.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">
                        {notaParaVisualizar.tomador.email}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Serviço */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Description color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Serviço Prestado
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    {notaParaVisualizar.servico.descricao}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                    <Chip label={`CNAE: ${notaParaVisualizar.servico.cnae}`} size="small" variant="outlined" />
                    {notaParaVisualizar.servico.codigoTributacaoMunicipal && (
                      <Chip label={`Código Municipal: ${notaParaVisualizar.servico.codigoTributacaoMunicipal}`} size="small" variant="outlined" />
                    )}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Local de Prestação:</strong> {notaParaVisualizar.localPrestacao?.municipio}/{notaParaVisualizar.localPrestacao?.uf}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Valores */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Valores e Tributos
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={2}>
                      <Typography variant="caption" color="text.secondary">
                        Valor do Serviço
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {formatCurrency(notaParaVisualizar.valores.valorServico)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                      <Typography variant="caption" color="text.secondary">
                        Base de Cálculo
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatCurrency(notaParaVisualizar.valores.baseCalculo)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                      <Typography variant="caption" color="text.secondary">
                        ISS ({notaParaVisualizar.tributos.iss.aliquota}%)
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="warning.main">
                        {formatCurrency(notaParaVisualizar.tributos.iss.valor)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                      <Typography variant="caption" color="text.secondary">
                        ISS Retido
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {notaParaVisualizar.tributos.iss.retido ? 'Sim' : 'Não'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                      <Typography variant="caption" color="text.secondary">
                        Valor Líquido
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="success.main">
                        {formatCurrency(notaParaVisualizar.valores.valorLiquido)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Protocolo - apenas para notas emitidas */}
              {notaParaVisualizar.status === 'emitida' && notaParaVisualizar.protocoloPrefeitura && (
                <Grid item xs={12}>
                  <Alert severity="success" icon={<CheckCircle />}>
                    <Typography variant="body2">
                      <strong>Protocolo da Prefeitura:</strong> {notaParaVisualizar.protocoloPrefeitura}
                    </Typography>
                    {notaParaVisualizar.codigoVerificacao && (
                      <Typography variant="body2">
                        <strong>Código de Verificação:</strong> {notaParaVisualizar.codigoVerificacao}
                      </Typography>
                    )}
                  </Alert>
                </Grid>
              )}

              {/* Rascunho - alerta para completar */}
              {notaParaVisualizar.status === 'rascunho' && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    <Typography variant="body2">
                      Este é um <strong>rascunho</strong>. Clique em "Continuar Edição" para completar e emitir a nota fiscal.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button onClick={() => setVisualizarDialogOpen(false)}>
            Fechar
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {notaParaVisualizar?.status === 'rascunho' && (
              <Button 
                variant="contained" 
                startIcon={<Edit />}
                onClick={() => {
                  navigate(`/notas/emitir?rascunho=${notaParaVisualizar.id}`);
                  setVisualizarDialogOpen(false);
                }}
              >
                Continuar Edição
              </Button>
            )}
            {notaParaVisualizar?.status === 'emitida' && (
              <>
                <Button 
                  variant="outlined" 
                  startIcon={<ContentCopy />}
                  onClick={() => {
                    if (notaParaVisualizar) {
                      handleDuplicarNota(notaParaVisualizar);
                      setVisualizarDialogOpen(false);
                    }
                  }}
                >
                  Duplicar
                </Button>
                <Button variant="outlined" startIcon={<Send />}>
                  Enviar por E-mail
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Download />}
                  onClick={() => notaParaVisualizar && handleDownloadPdf(notaParaVisualizar)}
                >
                  Download PDF
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default NotasPage;



