import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  CircularProgress,
  Autocomplete,
  Snackbar,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  MoreVert,
  Business,
  Person,
  Visibility,
  Close,
  FileDownload,
  ContentCopy,
  CloudSync,
  History,
  Receipt,
  LocalOffer,
} from '@mui/icons-material';
import type { Tomador } from '../../../types';
import { HistoricoTomadorDialog, ConsultaCNPJDialog } from '../components';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { cepService } from '../../../services/cepService';
import tomadoresService from '../../../services/tomadoresService';
import { useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';

// Tags disponíveis
const tagsDisponiveis = [
  { id: '1', label: 'VIP', color: '#f59e0b' },
  { id: '2', label: 'Recorrente', color: '#10b981' },
  { id: '3', label: 'Novo', color: '#3b82f6' },
  { id: '4', label: 'Inadimplente', color: '#ef4444' },
  { id: '5', label: 'Governo', color: '#8b5cf6' },
  { id: '6', label: 'Educação', color: '#06b6d4' },
  { id: '7', label: 'Saúde', color: '#ec4899' },
  { id: '8', label: 'Tecnologia', color: '#6366f1' },
];

const formatDocument = (doc: string, tipo: 'pj' | 'pf'): string => {
  if (tipo === 'pj') {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Validação de CPF
const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
  
  return true;
};

// Validação de CNPJ
const validarCNPJ = (cnpj: string): boolean => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpjLimpo)) return false;
  
  const calcDigit = (base: string, weights: number[]) => {
    let soma = 0;
    for (let i = 0; i < weights.length; i++) {
      soma += parseInt(base.charAt(i)) * weights[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  const digit1 = calcDigit(cnpjLimpo.substring(0, 12), weights1);
  const digit2 = calcDigit(cnpjLimpo.substring(0, 12) + digit1, weights2);
  
  return (
    cnpjLimpo.charAt(12) === digit1.toString() &&
    cnpjLimpo.charAt(13) === digit2.toString()
  );
};

const TomadoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { company } = useAppSelector((state: RootState) => state.auth);
  
  // Estados para dados da API
  const [allTomadores, setAllTomadores] = useState<Tomador[]>([]); // Todos os tomadores
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTomador, setSelectedTomador] = useState<Tomador | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Novos estados para dialogs
  const [historicoDialogOpen, setHistoricoDialogOpen] = useState(false);
  const [consultaCNPJDialogOpen, setConsultaCNPJDialogOpen] = useState(false);
  const [tomadorHistorico, setTomadorHistorico] = useState<Tomador | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  
  // Estados para diálogo de confirmação e snackbar
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tomadorToDelete, setTomadorToDelete] = useState<Tomador | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Form state
  const [formData, setFormData] = useState({
    tipo: 'pj' as 'pj' | 'pf',
    documento: '',
    razaoSocial: '',
    nomeFantasia: '',
    nome: '',
    inscricaoMunicipal: '',
    inscricaoEstadual: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    codigoMunicipio: '',
    email: '',
    telefone: '',
  });

  // Buscar TODOS os tomadores da API uma única vez
  const fetchTomadores = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      // Buscar todos os tomadores (ativos e inativos) - limite máximo do backend é 100
      const response = await tomadoresService.findAll({
        empresaId: company.id,
        limit: 100,
      });
      
      // Buscar inativos separadamente
      const inativosResponse = await tomadoresService.findAll({
        empresaId: company.id,
        ativo: false,
        limit: 100,
      });
      
      // Combinar tomadores ativos e inativos (removendo duplicatas)
      const ativos = response.items || [];
      const inativos = inativosResponse.items || [];
      const todosMap = new Map<string, Tomador>();
      ativos.forEach(t => todosMap.set(t.id, t));
      inativos.forEach(t => todosMap.set(t.id, t));
      
      setAllTomadores(Array.from(todosMap.values()));
    } catch (err: any) {
      console.error('Erro ao carregar tomadores:', err);
      setError(err.response?.data?.message || 'Erro ao carregar tomadores');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchTomadores();
  }, [fetchTomadores]);

  // Calcular estatísticas baseado nos dados locais
  const stats = useMemo(() => {
    const ativos = allTomadores.filter(t => t.ativo !== false);
    return {
      todos: ativos.length,
      pj: ativos.filter(t => t.tipo === 'pj').length,
      pf: ativos.filter(t => t.tipo === 'pf').length,
      inativos: allTomadores.filter(t => t.ativo === false).length,
    };
  }, [allTomadores]);

  // Filtrar tomadores baseado na aba ativa e busca
  const filteredTomadores = useMemo(() => {
    let filtered = allTomadores;
    
    // Filtrar por aba
    switch (activeTab) {
      case 1: // PJ
        filtered = filtered.filter(t => t.tipo === 'pj' && t.ativo !== false);
        break;
      case 2: // PF
        filtered = filtered.filter(t => t.tipo === 'pf' && t.ativo !== false);
        break;
      case 3: // Inativos
        filtered = filtered.filter(t => t.ativo === false);
        break;
      default: // Todos (ativos)
        filtered = filtered.filter(t => t.ativo !== false);
    }
    
    // Filtrar por busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        (t.razaoSocial?.toLowerCase().includes(search)) ||
        (t.nomeFantasia?.toLowerCase().includes(search)) ||
        (t.nome?.toLowerCase().includes(search)) ||
        (t.documento?.includes(search.replace(/\D/g, ''))) ||
        (t.email?.toLowerCase().includes(search))
      );
    }
    
    // Filtrar por tags
    if (tagFilter.length > 0) {
      filtered = filtered.filter(t => 
        t.tags && t.tags.some(tag => tagFilter.includes(tag))
      );
    }
    
    return filtered;
  }, [allTomadores, activeTab, searchTerm, tagFilter]);

  // Paginar dados filtrados
  const paginatedTomadores = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredTomadores.slice(start, start + rowsPerPage);
  }, [filteredTomadores, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredTomadores.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(0);
    }
  }, [filteredTomadores.length, rowsPerPage, page]);

  const tabs = [
    { label: 'Todos', count: stats.todos },
    { label: 'Pessoa Jurídica', count: stats.pj },
    { label: 'Pessoa Física', count: stats.pf },
    { label: 'Inativos', count: stats.inativos },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tomador: Tomador) => {
    setAnchorEl(event.currentTarget);
    setSelectedTomador(tomador);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', tomador?: Tomador) => {
    setDialogMode(mode);
    setSelectedTomador(tomador || null);
    if (tomador) {
      setFormData({
        tipo: tomador.tipo,
        documento: tomador.documento,
        razaoSocial: tomador.razaoSocial || '',
        nomeFantasia: tomador.nomeFantasia || '',
        nome: tomador.nome || '',
        inscricaoMunicipal: tomador.inscricaoMunicipal || '',
        inscricaoEstadual: tomador.inscricaoEstadual || '',
        cep: tomador.endereco.cep,
        logradouro: tomador.endereco.logradouro,
        numero: tomador.endereco.numero,
        complemento: tomador.endereco.complemento || '',
        bairro: tomador.endereco.bairro,
        cidade: tomador.endereco.cidade,
        uf: tomador.endereco.uf,
        codigoMunicipio: tomador.endereco.codigoMunicipio || '',
        email: tomador.email,
        telefone: tomador.telefone || '',
      });
      setSelectedTags(tomador.tags || []);
    } else {
      setFormData({
        tipo: 'pj',
        documento: '',
        razaoSocial: '',
        nomeFantasia: '',
        nome: '',
        inscricaoMunicipal: '',
        inscricaoEstadual: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        codigoMunicipio: '',
        email: '',
        telefone: '',
      });
      setSelectedTags([]);
    }
    setFormError(null);
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleTipoChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, tipo: event.target.value as 'pj' | 'pf' });
  };

  const handleBuscarCEP = async (cepValue?: string) => {
    const cep = (cepValue || formData.cep).replace(/\D/g, '');
    if (cep.length !== 8) {
      if (!cepValue) setFormError('CEP deve ter 8 dígitos');
      return;
    }

    setCepLoading(true);
    setFormError(null);
    try {
      const endereco = await cepService.consultar(cep);
      if (endereco) {
        setFormData(prev => ({
          ...prev,
          cep: endereco.cep,
          logradouro: endereco.logradouro,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          uf: endereco.uf,
          codigoMunicipio: endereco.codigoMunicipio,
        }));
      } else {
        setFormError('CEP não encontrado');
        // Limpar campos de endereço se CEP inválido
        setFormData(prev => ({
          ...prev,
          logradouro: '',
          bairro: '',
          cidade: '',
          uf: '',
          codigoMunicipio: '',
        }));
      }
    } catch {
      setFormError('Erro ao consultar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  // Buscar CEP automaticamente quando tiver 8 dígitos
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, cep: value });
    
    const cepLimpo = value.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      handleBuscarCEP(cepLimpo);
    } else if (cepLimpo.length < 8) {
      // Limpar campos se CEP incompleto
      setFormData(prev => ({
        ...prev,
        cep: value,
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        codigoMunicipio: '',
      }));
    }
  };

  const dialogTitle = {
    create: 'Novo Tomador',
    edit: 'Editar Tomador',
    view: 'Detalhes do Tomador',
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Tomadores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cadastro de clientes para emissão de notas fiscais
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<CloudSync />}
            onClick={() => setConsultaCNPJDialogOpen(true)}
          >
            Importar CNPJ
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('create')}
          >
            Novo Tomador
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.todos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Tomadores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.pj}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pessoa Jurídica
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {stats.pf}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pessoa Física
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(allTomadores.reduce((sum, t) => sum + (t.faturamentoTotal || 0), 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faturamento Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Card */}
      <Card>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Tabs value={activeTab} onChange={(_, v) => { setActiveTab(v); setPage(0); }}>
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
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar por nome, CNPJ/CPF, email..."
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 350 }}
            />
            <Autocomplete
              multiple
              size="small"
              options={tagsDisponiveis.map(t => t.label)}
              value={tagFilter}
              onChange={(_, newValue) => {
                setTagFilter(newValue);
                setPage(0);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Filtrar por tags..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <LocalOffer color="action" fontSize="small" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((tag, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: tagsDisponiveis.find(t => t.label === tag)?.color || '#9e9e9e',
                      color: 'white',
                    }}
                  />
                ))
              }
              sx={{ minWidth: 280 }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tomador</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Notas Emitidas</TableCell>
                  <TableCell>Faturamento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={32} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Carregando tomadores...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedTomadores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nenhum tomador encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedTomadores.map((tomador) => (
                    <TableRow key={tomador.id} hover sx={!tomador.ativo ? { opacity: 0.6 } : undefined}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 220, maxWidth: 320 }}>
                          <Avatar sx={{ bgcolor: tomador.tipo === 'pj' ? 'primary.main' : 'secondary.main' }}>
                            {tomador.tipo === 'pj' ? <Business /> : <Person />}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Tooltip title={tomador.razaoSocial || tomador.nome} disableInteractive>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, maxWidth: 240 }}
                                noWrap
                              >
                                {tomador.razaoSocial || tomador.nome}
                              </Typography>
                            </Tooltip>
                            {tomador.nomeFantasia && (
                              <Tooltip title={tomador.nomeFantasia} disableInteractive>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 240 }}>
                                  {tomador.nomeFantasia}
                                </Typography>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDocument(tomador.documento, tomador.tipo)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                          {tomador.tags && tomador.tags.slice(0, 3).map((tag, idx) => (
                            <Chip
                              key={idx}
                              label={tag}
                              size="small"
                              icon={<LocalOffer sx={{ fontSize: '14px !important' }} />}
                              sx={{ 
                                fontSize: '0.7rem',
                                height: 22,
                                bgcolor: tagsDisponiveis.find(t => t.label === tag)?.color || '#9e9e9e',
                                color: 'white',
                                '& .MuiChip-icon': { color: 'white' }
                              }}
                            />
                          ))}
                          {tomador.tags && tomador.tags.length > 3 && (
                            <Chip
                              label={`+${tomador.tags.length - 3}`}
                              size="small"
                              sx={{ fontSize: '0.7rem', height: 22 }}
                            />
                          )}
                          {(!tomador.tags || tomador.tags.length === 0) && (
                            <Typography variant="caption" color="text.secondary">-</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tomador.totalNotas}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(tomador.faturamentoTotal)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tomador.ativo ? 'Ativo' : 'Inativo'}
                          color={tomador.ativo ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualizar">
                          <IconButton size="small" onClick={() => handleOpenDialog('view', tomador)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleOpenDialog('edit', tomador)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, tomador)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredTomadores.length}
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
        <MenuItem onClick={() => selectedTomador && handleOpenDialog('view', selectedTomador)}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => selectedTomador && handleOpenDialog('edit', selectedTomador)}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedTomador) {
            setTomadorHistorico(selectedTomador);
            setHistoricoDialogOpen(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon><History fontSize="small" /></ListItemIcon>
          Ver Histórico
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedTomador) {
            navigate(`/notas/emitir?tomadorId=${selectedTomador.id}`);
          }
          handleMenuClose();
        }}>
          <ListItemIcon><Receipt fontSize="small" /></ListItemIcon>
          Emitir Nota
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (selectedTomador) {
            navigator.clipboard.writeText(selectedTomador.documento);
            setSnackbar({ open: true, message: 'Documento copiado para a área de transferência!', severity: 'success' });
          }
          handleMenuClose();
        }}>
          <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
          Copiar CNPJ/CPF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><FileDownload fontSize="small" /></ListItemIcon>
          Exportar dados
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            if (!selectedTomador) return;
            setTomadorToDelete(selectedTomador);
            setConfirmDialogOpen(true);
            handleMenuClose();
          }} 
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><Delete fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Excluir
        </MenuItem>
      </Menu>

      {/* Create/Edit/View Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {formData.tipo === 'pj' ? <Business color="primary" /> : <Person color="primary" />}
              {dialogTitle[dialogMode]}
            </Box>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {formError && (
              <Box sx={{ mb: 2 }}>
                <Typography color="error">{formError}</Typography>
              </Box>
            )}
            <Grid container spacing={3}>
              {/* Tipo de Pessoa */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth disabled={dialogMode === 'view'}>
                  <InputLabel>Tipo de Pessoa</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo de Pessoa"
                    onChange={handleTipoChange}
                  >
                    <MenuItem value="pj">Pessoa Jurídica</MenuItem>
                    <MenuItem value="pf">Pessoa Física</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Documento */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label={formData.tipo === 'pj' ? 'CNPJ' : 'CPF'}
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  disabled={dialogMode === 'view'}
                  placeholder={formData.tipo === 'pj' ? '00.000.000/0000-00' : '000.000.000-00'}
                  InputProps={{
                    endAdornment: formData.tipo === 'pj' && dialogMode !== 'view' && (
                      <InputAdornment position="end">
                        <Tooltip title="Buscar dados na Receita Federal">
                          <IconButton size="small">
                            <CloudSync />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Campos PJ */}
              {formData.tipo === 'pj' ? (
                <>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Razão Social"
                      value={formData.razaoSocial}
                      onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      value={formData.nomeFantasia}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Inscrição Municipal"
                      value={formData.inscricaoMunicipal}
                      onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Inscrição Estadual"
                      value={formData.inscricaoEstadual}
                      onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    disabled={dialogMode === 'view'}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>Endereço</Divider>
              </Grid>

              {/* Endereço */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="CEP *"
                  value={formData.cep}
                  onChange={handleCepChange}
                  disabled={dialogMode === 'view'}
                  placeholder="00000-000"
                  helperText={dialogMode !== 'view' ? 'Digite o CEP para preencher o endereço' : ''}
                  InputProps={{
                    endAdornment: dialogMode !== 'view' && (
                      <InputAdornment position="end">
                        {cepLoading ? (
                          <CircularProgress size={20} />
                        ) : formData.codigoMunicipio ? (
                          <Tooltip title="CEP validado">
                            <Chip label="OK" size="small" color="success" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Buscar endereço pelo CEP">
                            <IconButton 
                              size="small" 
                              onClick={() => handleBuscarCEP()}
                              disabled={cepLoading}
                            >
                              <Search />
                            </IconButton>
                          </Tooltip>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  label="Logradouro"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                  disabled={dialogMode === 'view'}
                  InputProps={{ readOnly: dialogMode !== 'view' }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Número *"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Complemento"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  disabled={dialogMode === 'view'}
                  InputProps={{ readOnly: dialogMode !== 'view' }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={formData.cidade}
                  disabled={dialogMode === 'view'}
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.100' } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="UF"
                  value={formData.uf}
                  disabled={dialogMode === 'view'}
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.100' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>Contato</Divider>
              </Grid>

              {/* Contato */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  disabled={dialogMode === 'view'}
                  placeholder="(00) 00000-0000"
                />
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>Tags</Divider>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={tagsDisponiveis.map(t => t.label)}
                  value={selectedTags}
                  onChange={(_, newValue) => setSelectedTags(newValue)}
                  disabled={dialogMode === 'view'}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const tagConfig = tagsDisponiveis.find(t => t.label === option);
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          label={option}
                          size="small"
                          {...tagProps}
                          sx={{
                            bgcolor: tagConfig?.color || '#6b7280',
                            color: 'white',
                          }}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Adicionar tags..."
                      helperText="Selecione tags existentes ou digite para criar novas"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>
            {dialogMode === 'view' ? 'Fechar' : 'Cancelar'}
          </Button>
          {dialogMode !== 'view' && (
            <Button 
              variant="contained"
              disabled={!company?.id}
              onClick={async () => {
                if (!company?.id) return;
                setFormError(null);

                const email = formData.email.trim();
                const uf = formData.uf.trim().toUpperCase();
                const cidade = formData.cidade.trim();
                const tagsLimpos = selectedTags.map(t => t.trim()).filter(Boolean);

                // Validar documento (CPF ou CNPJ)
                const docLimpo = formData.documento.replace(/\D/g, '');
                if (formData.tipo === 'pf') {
                  if (!validarCPF(docLimpo)) {
                    setFormError('CPF inválido. Verifique os dígitos informados.');
                    return;
                  }
                  // Validar nome para PF
                  if (!formData.nome.trim()) {
                    setFormError('Nome completo é obrigatório para pessoa física');
                    return;
                  }
                } else {
                  if (!validarCNPJ(docLimpo)) {
                    setFormError('CNPJ inválido. Verifique os dígitos informados.');
                    return;
                  }
                  // Validar razão social para PJ
                  if (!formData.razaoSocial.trim()) {
                    setFormError('Razão social é obrigatória para pessoa jurídica');
                    return;
                  }
                }

                // Validar CEP obrigatório
                const cepLimpo = formData.cep.replace(/\D/g, '');
                if (!cepLimpo || cepLimpo.length !== 8) {
                  setFormError('CEP é obrigatório e deve ter 8 dígitos');
                  return;
                }

                // Validar código do município (preenchido pela busca de CEP)
                if (!formData.codigoMunicipio) {
                  setFormError('Endereço não validado. Por favor, aguarde a busca automática do CEP ou clique no botão de busca.');
                  return;
                }

                // Validar número obrigatório
                if (!formData.numero.trim()) {
                  setFormError('Número do endereço é obrigatório');
                  return;
                }

                if (email && !/^\S+@\S+\.\S+$/.test(email)) {
                  setFormError('E-mail inválido');
                  return;
                }

                const codigoMunicipio = formData.codigoMunicipio;
                try {
                  // Para PF: enviar apenas 'nome', para PJ: enviar apenas 'razaoSocial'
                  // Isso evita conflito no mapeamento do backend
                  const tomadorData = {
                    tipo: formData.tipo,
                    documento: formData.documento.replace(/\D/g, ''),
                    // Para PF, nome vai como razaoSocial no backend
                    razaoSocial: formData.tipo === 'pf' ? formData.nome : (formData.razaoSocial || undefined),
                    nomeFantasia: formData.tipo === 'pj' ? (formData.nomeFantasia || undefined) : undefined,
                    nome: formData.tipo === 'pf' ? formData.nome : undefined,
                    inscricaoMunicipal: formData.inscricaoMunicipal || undefined,
                    inscricaoEstadual: formData.inscricaoEstadual || undefined,
                    endereco: {
                      cep: formData.cep.replace(/\D/g, ''),
                      logradouro: formData.logradouro,
                      numero: formData.numero,
                      complemento: formData.complemento || undefined,
                      bairro: formData.bairro,
                      cidade,
                      uf,
                      codigoMunicipio: codigoMunicipio || '',
                    },
                    email: email || undefined,
                    telefone: formData.telefone || undefined,
                    tags: tagsLimpos.length > 0 ? tagsLimpos : undefined,
                    empresaId: company.id,
                  };
                  
                  if (dialogMode === 'create') {
                    await tomadoresService.create(tomadorData);
                  } else if (dialogMode === 'edit' && selectedTomador) {
                    await tomadoresService.update(selectedTomador.id, tomadorData);
                  }
                  
                  setDialogOpen(false);
                  fetchTomadores();
                } catch (err: any) {
                  console.error('Erro ao salvar tomador:', err);
                  setFormError(err.response?.data?.message || 'Erro ao salvar tomador');
                }
              }}
            >
              {dialogMode === 'create' ? 'Cadastrar' : 'Salvar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog de Histórico do Tomador */}
      <HistoricoTomadorDialog
        open={historicoDialogOpen}
        onClose={() => {
          setHistoricoDialogOpen(false);
          setTomadorHistorico(null);
        }}
        tomador={tomadorHistorico}
      />

      {/* Dialog de Consulta CNPJ */}
      <ConsultaCNPJDialog
        open={consultaCNPJDialogOpen}
        onClose={() => setConsultaCNPJDialogOpen(false)}
        onImportar={(dados) => {
          setFormData({
            tipo: dados.tipo || 'pj',
            documento: dados.documento || '',
            razaoSocial: dados.razaoSocial || '',
            nomeFantasia: dados.nomeFantasia || '',
            nome: dados.nome || '',
            inscricaoMunicipal: dados.inscricaoMunicipal || '',
            inscricaoEstadual: dados.inscricaoEstadual || '',
            cep: dados.endereco?.cep || '',
            logradouro: dados.endereco?.logradouro || '',
            numero: dados.endereco?.numero || '',
            complemento: dados.endereco?.complemento || '',
            bairro: dados.endereco?.bairro || '',
            cidade: dados.endereco?.cidade || '',
            uf: dados.endereco?.uf || '',
            codigoMunicipio: dados.endereco?.codigoMunicipio || '',
            email: dados.email || '',
            telefone: dados.telefone || '',
          });
          setDialogMode('create');
          setDialogOpen(true);
        }}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setTomadorToDelete(null);
        }}
        onConfirm={async () => {
          if (!tomadorToDelete) return;
          setDeleteLoading(true);
          try {
            await tomadoresService.remove(tomadorToDelete.id);
            setSnackbar({ open: true, message: 'Tomador excluído com sucesso!', severity: 'success' });
            fetchTomadores();
          } catch (err: any) {
            console.error('Erro ao excluir tomador:', err);
            setSnackbar({ 
              open: true, 
              message: err.response?.data?.message || 'Erro ao excluir tomador', 
              severity: 'error' 
            });
          } finally {
            setDeleteLoading(false);
            setConfirmDialogOpen(false);
            setTomadorToDelete(null);
          }
        }}
        title="Excluir Tomador"
        message={`Tem certeza que deseja excluir o tomador "${tomadorToDelete?.razaoSocial || tomadorToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        loading={deleteLoading}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TomadoresPage;


