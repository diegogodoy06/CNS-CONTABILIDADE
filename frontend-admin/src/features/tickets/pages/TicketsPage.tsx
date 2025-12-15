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
  Badge,
  LinearProgress,
  Autocomplete,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Edit,
  Assignment,
  AssignmentInd,
  CheckCircle,
  Schedule,
  Warning,
  Error as ErrorIcon,
  Send,
  Close,
  Business,
  Person,
  AccessTime,
  FilterList,
  Refresh,
  BarChart,
  Message,
  Star,
} from '@mui/icons-material';
import { format, formatDistanceToNow, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data de tickets
const mockTickets = [
  {
    id: '89',
    clienteId: '4',
    clienteNome: 'Indústria 123 LTDA',
    assunto: 'Dúvida sobre IRPF',
    descricao: 'Preciso esclarecer algumas dúvidas sobre a declaração de IRPF para o próximo ano.',
    categoria: 'duvida' as const,
    prioridade: 'alta' as const,
    status: 'aberto' as const,
    dataCriacao: '2025-12-12T14:00:00',
    dataAtualizacao: '2025-12-12T14:00:00',
    responsavel: null,
    mensagens: 1,
    slaViolado: true,
  },
  {
    id: '88',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    assunto: 'Erro ao emitir NF-e',
    descricao: 'Estou recebendo erro de rejeição ao tentar emitir nota fiscal.',
    categoria: 'problema' as const,
    prioridade: 'urgente' as const,
    status: 'em_andamento' as const,
    dataCriacao: '2025-12-12T10:30:00',
    dataAtualizacao: '2025-12-13T09:15:00',
    responsavel: 'Carlos Contador',
    mensagens: 4,
    slaViolado: false,
  },
  {
    id: '87',
    clienteId: '3',
    clienteNome: 'Serviços XYZ LTDA',
    assunto: 'Solicitação de relatório anual',
    descricao: 'Preciso do relatório consolidado de faturamento de 2025.',
    categoria: 'solicitacao' as const,
    prioridade: 'media' as const,
    status: 'aguardando' as const,
    dataCriacao: '2025-12-11T16:00:00',
    dataAtualizacao: '2025-12-12T11:30:00',
    responsavel: 'Ana Assistente',
    mensagens: 3,
    slaViolado: false,
  },
  {
    id: '86',
    clienteId: '2',
    clienteNome: 'Comércio ABC ME',
    assunto: 'Cadastro de tomador',
    descricao: 'Como faço para cadastrar um novo tomador de serviços?',
    categoria: 'duvida' as const,
    prioridade: 'baixa' as const,
    status: 'resolvido' as const,
    dataCriacao: '2025-12-10T09:00:00',
    dataAtualizacao: '2025-12-10T14:45:00',
    responsavel: 'Carlos Contador',
    mensagens: 5,
    slaViolado: false,
    avaliacao: 5,
  },
  {
    id: '85',
    clienteId: '5',
    clienteNome: 'Consultoria DEF',
    assunto: 'Problema no acesso ao sistema',
    descricao: 'Não consigo fazer login desde ontem. Já tentei resetar a senha.',
    categoria: 'problema' as const,
    prioridade: 'alta' as const,
    status: 'resolvido' as const,
    dataCriacao: '2025-12-09T08:30:00',
    dataAtualizacao: '2025-12-09T10:15:00',
    responsavel: 'Ana Assistente',
    mensagens: 6,
    slaViolado: false,
    avaliacao: 4,
  },
  {
    id: '84',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    assunto: 'Atualização de certificado digital',
    descricao: 'Preciso atualizar meu certificado A1 que vai vencer.',
    categoria: 'solicitacao' as const,
    prioridade: 'media' as const,
    status: 'em_andamento' as const,
    dataCriacao: '2025-12-08T14:00:00',
    dataAtualizacao: '2025-12-12T16:30:00',
    responsavel: 'Carlos Contador',
    mensagens: 8,
    slaViolado: false,
  },
];

const mockColaboradores = [
  { id: '1', nome: 'Carlos Contador' },
  { id: '2', nome: 'Ana Assistente' },
  { id: '3', nome: 'João Admin' },
];

const TicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');
  const [filtroResponsavel, setFiltroResponsavel] = useState('');

  const tabs = [
    { label: 'Todos', count: mockTickets.length },
    { label: 'Abertos', count: mockTickets.filter(t => t.status === 'aberto').length, color: 'error' },
    { label: 'Em Andamento', count: mockTickets.filter(t => t.status === 'em_andamento').length, color: 'warning' },
    { label: 'Aguardando', count: mockTickets.filter(t => t.status === 'aguardando').length, color: 'info' },
    { label: 'Resolvidos', count: mockTickets.filter(t => t.status === 'resolvido').length, color: 'success' },
  ];

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch =
      ticket.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.includes(searchTerm);

    let matchesTab = true;
    if (activeTab === 1) matchesTab = ticket.status === 'aberto';
    if (activeTab === 2) matchesTab = ticket.status === 'em_andamento';
    if (activeTab === 3) matchesTab = ticket.status === 'aguardando';
    if (activeTab === 4) matchesTab = ticket.status === 'resolvido';

    let matchesCategoria = filtroCategoria === 'todos' || ticket.categoria === filtroCategoria;
    let matchesPrioridade = filtroPrioridade === 'todos' || ticket.prioridade === filtroPrioridade;
    let matchesResponsavel = !filtroResponsavel || ticket.responsavel === filtroResponsavel;

    return matchesSearch && matchesTab && matchesCategoria && matchesPrioridade && matchesResponsavel;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'aberto':
        return { color: 'error' as const, icon: <ErrorIcon fontSize="small" />, label: 'Aberto' };
      case 'em_andamento':
        return { color: 'warning' as const, icon: <Schedule fontSize="small" />, label: 'Em Andamento' };
      case 'aguardando':
        return { color: 'info' as const, icon: <AccessTime fontSize="small" />, label: 'Aguardando' };
      case 'resolvido':
        return { color: 'success' as const, icon: <CheckCircle fontSize="small" />, label: 'Resolvido' };
      default:
        return { color: 'default' as const, icon: null, label: status };
    }
  };

  const getPrioridadeConfig = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return { color: 'error' as const, label: 'Urgente', icon: '🔴' };
      case 'alta':
        return { color: 'warning' as const, label: 'Alta', icon: '🟠' };
      case 'media':
        return { color: 'info' as const, label: 'Média', icon: '🟡' };
      case 'baixa':
        return { color: 'default' as const, label: 'Baixa', icon: '🟢' };
      default:
        return { color: 'default' as const, label: prioridade, icon: '' };
    }
  };

  const getCategoriaConfig = (categoria: string) => {
    switch (categoria) {
      case 'duvida': return { label: 'Dúvida', color: 'primary' };
      case 'problema': return { label: 'Problema', color: 'error' };
      case 'solicitacao': return { label: 'Solicitação', color: 'info' };
      default: return { label: categoria, color: 'default' };
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, ticket: typeof mockTickets[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(ticket);
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
    abertos: mockTickets.filter(t => t.status === 'aberto').length,
    emAndamento: mockTickets.filter(t => t.status === 'em_andamento').length,
    slaViolado: mockTickets.filter(t => t.slaViolado).length,
    resolvidosHoje: mockTickets.filter(t => 
      t.status === 'resolvido' && 
      differenceInHours(new Date(), new Date(t.dataAtualizacao)) <= 24
    ).length,
  };

  const tempoMedioResposta = '2h 15min';
  const avaliacaoMedia = 4.5;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Central de Tickets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie as solicitações de suporte de todos os clientes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<BarChart />} variant="outlined">
            Relatórios
          </Button>
          <Button startIcon={<Refresh />} variant="contained">
            Atualizar
          </Button>
        </Box>
      </Box>

      {/* Cards de estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.abertos}</Typography>
                  <Typography variant="body2" color="text.secondary">Abertos</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', width: 48, height: 48 }}>
                  <ErrorIcon />
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
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.emAndamento}</Typography>
                  <Typography variant="body2" color="text.secondary">Em Andamento</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: stats.slaViolado > 0 ? 'error.main' : 'success.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.slaViolado}</Typography>
                  <Typography variant="body2" color="text.secondary">SLA Violado</Typography>
                </Box>
                <Avatar sx={{ bgcolor: stats.slaViolado > 0 ? 'error.light' : 'success.light', width: 48, height: 48 }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{tempoMedioResposta}</Typography>
                  <Typography variant="body2" color="text.secondary">Tempo Médio Resposta</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                  <AccessTime />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros e busca */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por ID, assunto ou cliente..."
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
            <Grid item xs={12} sm={4} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={filtroCategoria}
                  label="Categoria"
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <MenuItem value="todos">Todas</MenuItem>
                  <MenuItem value="duvida">Dúvida</MenuItem>
                  <MenuItem value="problema">Problema</MenuItem>
                  <MenuItem value="solicitacao">Solicitação</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={filtroPrioridade}
                  label="Prioridade"
                  onChange={(e) => setFiltroPrioridade(e.target.value)}
                >
                  <MenuItem value="todos">Todas</MenuItem>
                  <MenuItem value="urgente">🔴 Urgente</MenuItem>
                  <MenuItem value="alta">🟠 Alta</MenuItem>
                  <MenuItem value="media">🟡 Média</MenuItem>
                  <MenuItem value="baixa">🟢 Baixa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Autocomplete
                size="small"
                options={mockColaboradores}
                getOptionLabel={(option) => option.nome}
                value={mockColaboradores.find(c => c.nome === filtroResponsavel) || null}
                onChange={(_, value) => setFiltroResponsavel(value?.nome || '')}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Responsável" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setFiltroCategoria('todos');
                  setFiltroPrioridade('todos');
                  setFiltroResponsavel('');
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

      {/* Tabela de tickets */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Assunto</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell>Atualização</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status);
                  const prioridadeConfig = getPrioridadeConfig(ticket.prioridade);
                  const categoriaConfig = getCategoriaConfig(ticket.categoria);
                  
                  return (
                    <TableRow 
                      key={ticket.id} 
                      hover
                      sx={ticket.slaViolado ? { bgcolor: 'error.50' } : {}}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            #{ticket.id}
                          </Typography>
                          {ticket.slaViolado && (
                            <Tooltip title="SLA Violado">
                              <Warning fontSize="small" color="error" />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {ticket.assunto}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Message fontSize="small" sx={{ color: 'text.secondary', fontSize: 14 }} />
                            <Typography variant="caption" color="text.secondary">
                              {ticket.mensagens} {ticket.mensagens === 1 ? 'mensagem' : 'mensagens'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business fontSize="small" color="action" />
                          <Typography variant="body2">{ticket.clienteNome}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={categoriaConfig.label}
                          size="small"
                          color={categoriaConfig.color as any}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span>{prioridadeConfig.icon}</span>
                          <Typography variant="body2">{prioridadeConfig.label}</Typography>
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
                        {ticket.responsavel ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                              {ticket.responsavel.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{ticket.responsavel}</Typography>
                          </Box>
                        ) : (
                          <Chip label="Não atribuído" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={format(new Date(ticket.dataAtualizacao), "dd/MM/yyyy 'às' HH:mm")}>
                          <Typography variant="body2">
                            {formatDistanceToNow(new Date(ticket.dataAtualizacao), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuOpen(e, ticket)}>
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
          count={filteredTickets.length}
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
          <ListItemIcon><Send fontSize="small" /></ListItemIcon>
          Responder
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><AssignmentInd fontSize="small" /></ListItemIcon>
          Atribuir responsável
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          Alterar prioridade
        </MenuItem>
        <Divider />
        {selectedTicket?.status !== 'resolvido' ? (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
            Marcar como resolvido
          </MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><Schedule fontSize="small" /></ListItemIcon>
            Reabrir ticket
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Ticket #{selectedTicket?.id}</Typography>
              <Chip
                icon={getStatusConfig(selectedTicket?.status || '').icon}
                label={getStatusConfig(selectedTicket?.status || '').label}
                size="small"
                color={getStatusConfig(selectedTicket?.status || '').color}
              />
              {selectedTicket?.slaViolado && (
                <Chip
                  icon={<Warning />}
                  label="SLA Violado"
                  size="small"
                  color="error"
                />
              )}
            </Box>
            <IconButton onClick={() => setDetalhesDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>{selectedTicket?.assunto}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTicket?.descricao}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Informações do Ticket
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Cliente:</Typography>
                    <Typography variant="body2">{selectedTicket?.clienteNome}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Categoria:</Typography>
                    <Chip 
                      label={getCategoriaConfig(selectedTicket?.categoria || '').label} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Prioridade:</Typography>
                    <Typography variant="body2">
                      {getPrioridadeConfig(selectedTicket?.prioridade || '').icon} {getPrioridadeConfig(selectedTicket?.prioridade || '').label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Responsável:</Typography>
                    <Typography variant="body2">{selectedTicket?.responsavel || 'Não atribuído'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Datas
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Criado em:</Typography>
                    <Typography variant="body2">
                      {selectedTicket?.dataCriacao && format(new Date(selectedTicket.dataCriacao), "dd/MM/yyyy 'às' HH:mm")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Última atualização:</Typography>
                    <Typography variant="body2">
                      {selectedTicket?.dataAtualizacao && format(new Date(selectedTicket.dataAtualizacao), "dd/MM/yyyy 'às' HH:mm")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Mensagens:</Typography>
                    <Typography variant="body2">{selectedTicket?.mensagens}</Typography>
                  </Box>
                  {selectedTicket?.avaliacao && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Avaliação:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            fontSize="small" 
                            sx={{ color: i < (selectedTicket?.avaliacao || 0) ? 'warning.main' : 'grey.300' }} 
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Histórico de Mensagens
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Carregue os detalhes do ticket para ver o histórico completo de mensagens.
                </Typography>
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
            startIcon={<AssignmentInd />}
          >
            Atribuir
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
          >
            Responder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketsPage;
