import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Paper,
  Grid,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  ContentCopy,
  Visibility,
  MoreVert,
  Send,
  Refresh,
  Warning,
  Description,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos para rascunho
interface Rascunho {
  id: string;
  tomadorNome: string;
  tomadorCnpjCpf: string;
  servicoDescricao: string;
  valor: number;
  criadoEm: string;
  atualizadoEm: string;
  competencia: string;
  status: 'incompleto' | 'pronto';
  etapa: number; // 1, 2 ou 3 do wizard
  camposFaltando?: string[];
}

// Mock de rascunhos
const mockRascunhos: Rascunho[] = [
  {
    id: '1',
    tomadorNome: 'Tech Solutions Ltda',
    tomadorCnpjCpf: '12.345.678/0001-90',
    servicoDescricao: 'Consultoria em Desenvolvimento de Software',
    valor: 15000,
    criadoEm: '2024-11-28T10:30:00',
    atualizadoEm: '2024-11-28T14:45:00',
    competencia: '12/2024',
    status: 'pronto',
    etapa: 3,
  },
  {
    id: '2',
    tomadorNome: 'ABC Comércio SA',
    tomadorCnpjCpf: '98.765.432/0001-10',
    servicoDescricao: '',
    valor: 0,
    criadoEm: '2024-11-25T09:00:00',
    atualizadoEm: '2024-11-25T09:15:00',
    competencia: '11/2024',
    status: 'incompleto',
    etapa: 1,
    camposFaltando: ['Descrição do serviço', 'Valor'],
  },
  {
    id: '3',
    tomadorNome: 'Maria Silva',
    tomadorCnpjCpf: '123.456.789-00',
    servicoDescricao: 'Serviços de Marketing Digital',
    valor: 3500,
    criadoEm: '2024-11-20T16:00:00',
    atualizadoEm: '2024-11-22T11:30:00',
    competencia: '11/2024',
    status: 'pronto',
    etapa: 3,
  },
  {
    id: '4',
    tomadorNome: 'Indústria XYZ',
    tomadorCnpjCpf: '11.222.333/0001-44',
    servicoDescricao: 'Manutenção de Equipamentos',
    valor: 8500,
    criadoEm: '2024-11-15T08:00:00',
    atualizadoEm: '2024-11-18T17:00:00',
    competencia: '11/2024',
    status: 'incompleto',
    etapa: 2,
    camposFaltando: ['CNAE', 'Código de Tributação'],
  },
  {
    id: '5',
    tomadorNome: 'Escritório Jurídico Associado',
    tomadorCnpjCpf: '55.666.777/0001-88',
    servicoDescricao: 'Assessoria Contábil Mensal',
    valor: 2800,
    criadoEm: '2024-10-30T14:00:00',
    atualizadoEm: '2024-10-30T14:30:00',
    competencia: '10/2024',
    status: 'pronto',
    etapa: 3,
  },
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const RascunhosPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [rascunhos] = useState<Rascunho[]>(mockRascunhos);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRascunho, setMenuRascunho] = useState<Rascunho | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'multiple'>('single');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Filtro de busca
  const filteredRascunhos = useMemo(() => {
    if (!search) return rascunhos;
    const searchLower = search.toLowerCase();
    return rascunhos.filter(r =>
      r.tomadorNome.toLowerCase().includes(searchLower) ||
      r.tomadorCnpjCpf.includes(search) ||
      r.servicoDescricao.toLowerCase().includes(searchLower)
    );
  }, [rascunhos, search]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = rascunhos.length;
    const prontos = rascunhos.filter(r => r.status === 'pronto').length;
    const incompletos = rascunhos.filter(r => r.status === 'incompleto').length;
    const antigos = rascunhos.filter(r => {
      const dias = differenceInDays(new Date(), parseISO(r.atualizadoEm));
      return dias > 7;
    }).length;
    return { total, prontos, incompletos, antigos };
  }, [rascunhos]);

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(filteredRascunhos.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rascunho: Rascunho) => {
    setAnchorEl(event.currentTarget);
    setMenuRascunho(rascunho);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRascunho(null);
  };

  const handleEdit = (rascunho: Rascunho) => {
    navigate(`/notas/emitir?rascunho=${rascunho.id}&etapa=${rascunho.etapa}`);
    handleMenuClose();
  };

  const handleView = (_rascunho: Rascunho) => {
    // Abre preview do rascunho
    setSnackbar({
      open: true,
      message: 'Abrindo preview do rascunho...',
      severity: 'info',
    });
    handleMenuClose();
  };

  const handleDuplicate = (rascunho: Rascunho) => {
    setSnackbar({
      open: true,
      message: `Rascunho "${rascunho.tomadorNome}" duplicado com sucesso!`,
      severity: 'success',
    });
    handleMenuClose();
  };

  const handleEmitir = (rascunho: Rascunho) => {
    if (rascunho.status === 'incompleto') {
      setSnackbar({
        open: true,
        message: 'Rascunho incompleto. Complete os dados antes de emitir.',
        severity: 'error',
      });
      return;
    }
    navigate(`/notas/emitir?rascunho=${rascunho.id}&emitir=true`);
    handleMenuClose();
  };

  const handleDeleteClick = (target: 'single' | 'multiple') => {
    setDeleteTarget(target);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget === 'single' && menuRascunho) {
      setSnackbar({
        open: true,
        message: `Rascunho "${menuRascunho.tomadorNome}" excluído!`,
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: `${selectedIds.length} rascunho(s) excluído(s)!`,
        severity: 'success',
      });
      setSelectedIds([]);
    }
    setDeleteDialogOpen(false);
  };

  const getDiasAtras = (data: string): string => {
    const dias = differenceInDays(new Date(), parseISO(data));
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Ontem';
    return `${dias} dias atrás`;
  };

  const isRascunhoAntigo = (data: string): boolean => {
    return differenceInDays(new Date(), parseISO(data)) > 7;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Rascunhos de NF-e
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie suas notas fiscais em elaboração
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/notas/emitir')}
        >
          Nova Nota Fiscal
        </Button>
      </Box>

      {/* Alerta de rascunhos antigos */}
      {stats.antigos > 0 && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Atenção: {stats.antigos} rascunho(s) não atualizado(s) há mais de 7 dias
          </Typography>
          <Typography variant="body2">
            Considere revisar ou excluir rascunhos antigos para manter sua lista organizada.
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Description sx={{ color: 'grey.500', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
            <Typography variant="caption" color="text.secondary">Total</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
            <Send sx={{ color: 'success.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>{stats.prontos}</Typography>
            <Typography variant="caption" color="text.secondary">Prontos p/ Emitir</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
            <Edit sx={{ color: 'warning.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{stats.incompletos}</Typography>
            <Typography variant="caption" color="text.secondary">Incompletos</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.50' }}>
            <CalendarToday sx={{ color: 'error.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>{stats.antigos}</Typography>
            <Typography variant="caption" color="text.secondary">Antigos (+7 dias)</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Card */}
      <Card>
        <CardContent>
          {/* Search and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Buscar por tomador, CNPJ/CPF ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ width: 350 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {selectedIds.length > 0 && (
                <>
                  <Chip
                    label={`${selectedIds.length} selecionado(s)`}
                    onDelete={() => setSelectedIds([])}
                    color="primary"
                    size="small"
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteClick('multiple')}
                  >
                    Excluir
                  </Button>
                </>
              )}
              <Tooltip title="Atualizar lista">
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Table */}
          {filteredRascunhos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Description sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Nenhum rascunho encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {search ? 'Tente ajustar sua busca.' : 'Comece criando uma nova nota fiscal.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/notas/emitir')}
              >
                Nova Nota Fiscal
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedIds.length > 0 && selectedIds.length < filteredRascunhos.length}
                          checked={filteredRascunhos.length > 0 && selectedIds.length === filteredRascunhos.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Tomador</TableCell>
                      <TableCell>Serviço</TableCell>
                      <TableCell align="right">Valor</TableCell>
                      <TableCell>Competência</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Atualizado</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRascunhos
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((rascunho) => (
                        <TableRow
                          key={rascunho.id}
                          hover
                          selected={selectedIds.includes(rascunho.id)}
                          sx={{
                            bgcolor: isRascunhoAntigo(rascunho.atualizadoEm) ? 'warning.50' : undefined,
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedIds.includes(rascunho.id)}
                              onChange={() => handleSelect(rascunho.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Person sx={{ color: 'grey.400' }} />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {rascunho.tomadorNome}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {rascunho.tomadorCnpjCpf}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              title={rascunho.servicoDescricao || 'Não informado'}
                            >
                              {rascunho.servicoDescricao || (
                                <Typography component="span" variant="body2" color="error">
                                  Não informado
                                </Typography>
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                fontFamily: 'monospace',
                                color: rascunho.valor > 0 ? 'success.main' : 'text.secondary',
                              }}
                            >
                              {rascunho.valor > 0 ? formatCurrency(rascunho.valor) : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rascunho.competencia}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={
                                rascunho.status === 'incompleto' && rascunho.camposFaltando
                                  ? `Faltando: ${rascunho.camposFaltando.join(', ')}`
                                  : ''
                              }
                            >
                              <Chip
                                label={rascunho.status === 'pronto' ? 'Pronto' : `Etapa ${rascunho.etapa}/3`}
                                size="small"
                                color={rascunho.status === 'pronto' ? 'success' : 'warning'}
                                variant={rascunho.status === 'pronto' ? 'filled' : 'outlined'}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={format(parseISO(rascunho.atualizadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}>
                              <Typography
                                variant="body2"
                                color={isRascunhoAntigo(rascunho.atualizadoEm) ? 'error' : 'text.secondary'}
                              >
                                {getDiasAtras(rascunho.atualizadoEm)}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => handleEdit(rascunho)}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {rascunho.status === 'pronto' && (
                              <Tooltip title="Emitir NF-e">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEmitir(rascunho)}
                                >
                                  <Send fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, rascunho)}>
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
                count={filteredRascunhos.length}
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => menuRascunho && handleEdit(menuRascunho)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={() => menuRascunho && handleView(menuRascunho)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => menuRascunho && handleDuplicate(menuRascunho)}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          Duplicar
        </MenuItem>
        {menuRascunho?.status === 'pronto' && (
          <MenuItem onClick={() => menuRascunho && handleEmitir(menuRascunho)}>
            <ListItemIcon>
              <Send fontSize="small" color="primary" />
            </ListItemIcon>
            Emitir NF-e
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDeleteClick('single')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Excluir
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget === 'single'
              ? `Tem certeza que deseja excluir o rascunho "${menuRascunho?.tomadorNome}"?`
              : `Tem certeza que deseja excluir ${selectedIds.length} rascunho(s)?`}
          </DialogContentText>
          <DialogContentText sx={{ mt: 1, color: 'warning.main' }}>
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RascunhosPage;
