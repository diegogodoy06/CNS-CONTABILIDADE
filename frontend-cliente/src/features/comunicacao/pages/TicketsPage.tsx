import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  useTheme,
  alpha,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Rating,
} from '@mui/material';
import {
  Add,
  Search,
  ConfirmationNumber,
  AccessTime,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  AttachFile,
  Send,
  PersonOutline,
  CalendarMonth,
  PriorityHigh,
  Info,
  Timer,
  Schedule,
  Warning,
  Star,
} from '@mui/icons-material';

// Tipos
interface Ticket {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  categoria: 'duvida' | 'problema' | 'solicitacao' | 'sugestao';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'aguardando_cliente' | 'resolvido' | 'fechado';
  dataCriacao: Date;
  dataAtualizacao: Date;
  atendente?: string;
  mensagens: TicketMessage[];
  avaliacao?: number;
  comentarioAvaliacao?: string;
  // Campos de SLA
  sla: {
    primeiraResposta: { prazo: Date; cumprido?: boolean; dataReal?: Date };
    resolucao: { prazo: Date; cumprido?: boolean; dataReal?: Date };
  };
}

interface TicketMessage {
  id: string;
  texto: string;
  autor: 'cliente' | 'atendente';
  nomeAutor: string;
  data: Date;
  anexos?: string[];
}

// Mock data
const mockTickets: Ticket[] = [
  {
    id: '1',
    numero: 'TK-2025-001234',
    titulo: 'Dúvida sobre emissão de nota fiscal',
    descricao: 'Não consigo encontrar o código de serviço correto para consultoria.',
    categoria: 'duvida',
    prioridade: 'media',
    status: 'resolvido',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    dataAtualizacao: new Date(Date.now() - 1000 * 60 * 60 * 2),
    atendente: 'Maria Santos',
    mensagens: [
      {
        id: '1',
        texto: 'Não consigo encontrar o código de serviço correto para consultoria.',
        autor: 'cliente',
        nomeAutor: 'Você',
        data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      },
      {
        id: '2',
        texto: 'Olá! Para consultoria em TI, você deve usar o código 1.05. Vou enviar uma tabela completa.',
        autor: 'atendente',
        nomeAutor: 'Maria Santos',
        data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
    ],
    avaliacao: 5,
    comentarioAvaliacao: 'Excelente atendimento!',
    sla: {
      primeiraResposta: { 
        prazo: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 4), 
        cumprido: true, 
        dataReal: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
      },
      resolucao: { 
        prazo: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), 
        cumprido: true, 
        dataReal: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
    },
  },
  {
    id: '2',
    numero: 'TK-2025-001235',
    titulo: 'Erro ao baixar guia de ISS',
    descricao: 'Quando clico para baixar a guia, aparece uma mensagem de erro.',
    categoria: 'problema',
    prioridade: 'alta',
    status: 'em_andamento',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 60 * 24),
    dataAtualizacao: new Date(Date.now() - 1000 * 60 * 30),
    atendente: 'João Oliveira',
    mensagens: [
      {
        id: '1',
        texto: 'Quando clico para baixar a guia, aparece uma mensagem de erro.',
        autor: 'cliente',
        nomeAutor: 'Você',
        data: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: '2',
        texto: 'Consegue enviar um print do erro?',
        autor: 'atendente',
        nomeAutor: 'João Oliveira',
        data: new Date(Date.now() - 1000 * 60 * 60 * 20),
      },
    ],
    sla: {
      primeiraResposta: { 
        prazo: new Date(Date.now() - 1000 * 60 * 60 * 22), 
        cumprido: true, 
        dataReal: new Date(Date.now() - 1000 * 60 * 60 * 20)
      },
      resolucao: { 
        prazo: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 horas restantes
        cumprido: false,
      },
    },
  },
  {
    id: '3',
    numero: 'TK-2025-001236',
    titulo: 'Solicitação de relatório personalizado',
    descricao: 'Preciso de um relatório com todas as notas emitidas para um cliente específico.',
    categoria: 'solicitacao',
    prioridade: 'baixa',
    status: 'aberto',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 60 * 2),
    dataAtualizacao: new Date(Date.now() - 1000 * 60 * 60 * 2),
    mensagens: [
      {
        id: '1',
        texto: 'Preciso de um relatório com todas as notas emitidas para um cliente específico.',
        autor: 'cliente',
        nomeAutor: 'Você',
        data: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ],
    sla: {
      primeiraResposta: { 
        prazo: new Date(Date.now() + 1000 * 60 * 60 * 22), // 22 horas restantes
        cumprido: false,
      },
      resolucao: { 
        prazo: new Date(Date.now() + 1000 * 60 * 60 * 72), // 72 horas restantes
        cumprido: false,
      },
    },
  },
];

const TicketsPage: React.FC = () => {
  const theme = useTheme();
  
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [openNewTicket, setOpenNewTicket] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [openRating, setOpenRating] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState('');
  
  // Novo ticket
  const [newTicket, setNewTicket] = useState({
    titulo: '',
    categoria: 'duvida',
    prioridade: 'media',
    descricao: '',
  });

  // Função para calcular tempo restante do SLA
  const getSlaTimeRemaining = (prazo: Date): { text: string; status: 'ok' | 'warning' | 'danger' | 'expired' } => {
    const now = new Date();
    const diff = prazo.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { text: 'Expirado', status: 'expired' };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d ${hours % 24}h`, status: 'ok' };
    } else if (hours > 4) {
      return { text: `${hours}h ${minutes}m`, status: 'ok' };
    } else if (hours > 1) {
      return { text: `${hours}h ${minutes}m`, status: 'warning' };
    } else {
      return { text: `${minutes}m`, status: 'danger' };
    }
  };

  // Componente de indicador SLA
  const SlaIndicator = ({ sla, label }: { sla: { prazo: Date; cumprido?: boolean; dataReal?: Date }; label: string }) => {
    if (sla.cumprido) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption" color="success.main">
            {label} - Cumprido
          </Typography>
        </Box>
      );
    }
    
    const timeInfo = getSlaTimeRemaining(sla.prazo);
    const color = {
      ok: 'success.main',
      warning: 'warning.main',
      danger: 'error.main',
      expired: 'error.main',
    }[timeInfo.status];

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {timeInfo.status === 'expired' ? (
          <Warning sx={{ fontSize: 16, color }} />
        ) : (
          <Timer sx={{ fontSize: 16, color }} />
        )}
        <Typography variant="caption" sx={{ color }}>
          {label}: {timeInfo.text}
        </Typography>
      </Box>
    );
  };

  const getStatusColor = (status: Ticket['status']) => {
    const colors: Record<Ticket['status'], 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
      aberto: 'primary',
      em_andamento: 'warning',
      aguardando_cliente: 'default',
      resolvido: 'success',
      fechado: 'default',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Ticket['status']) => {
    const labels: Record<Ticket['status'], string> = {
      aberto: 'Aberto',
      em_andamento: 'Em Andamento',
      aguardando_cliente: 'Aguardando Cliente',
      resolvido: 'Resolvido',
      fechado: 'Fechado',
    };
    return labels[status];
  };

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'aberto':
        return <ConfirmationNumber />;
      case 'em_andamento':
        return <HourglassEmpty />;
      case 'aguardando_cliente':
        return <AccessTime />;
      case 'resolvido':
        return <CheckCircle />;
      case 'fechado':
        return <Cancel />;
      default:
        return <ConfirmationNumber />;
    }
  };

  const getPrioridadeColor = (prioridade: Ticket['prioridade']) => {
    const colors: Record<Ticket['prioridade'], 'default' | 'info' | 'warning' | 'error'> = {
      baixa: 'default',
      media: 'info',
      alta: 'warning',
      urgente: 'error',
    };
    return colors[prioridade];
  };

  const getCategoriaLabel = (categoria: Ticket['categoria']) => {
    const labels: Record<Ticket['categoria'], string> = {
      duvida: 'Dúvida',
      problema: 'Problema',
      solicitacao: 'Solicitação',
      sugestao: 'Sugestão',
    };
    return labels[categoria];
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || ticket.status === filterStatus;
    const matchesTab = 
      activeTab === 0 || // Todos
      (activeTab === 1 && ['aberto', 'em_andamento', 'aguardando_cliente'].includes(ticket.status)) ||
      (activeTab === 2 && ['resolvido', 'fechado'].includes(ticket.status));
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleCreateTicket = () => {
    // Calcular SLA baseado na prioridade
    const slaPrazos = {
      urgente: { primeiraResposta: 2, resolucao: 8 },
      alta: { primeiraResposta: 4, resolucao: 24 },
      media: { primeiraResposta: 8, resolucao: 48 },
      baixa: { primeiraResposta: 24, resolucao: 72 },
    };

    const prazos = slaPrazos[newTicket.prioridade as keyof typeof slaPrazos];
    const now = new Date();

    const ticket: Ticket = {
      id: Date.now().toString(),
      numero: `TK-2025-${String(tickets.length + 1237).padStart(6, '0')}`,
      titulo: newTicket.titulo,
      descricao: newTicket.descricao,
      categoria: newTicket.categoria as Ticket['categoria'],
      prioridade: newTicket.prioridade as Ticket['prioridade'],
      status: 'aberto',
      dataCriacao: now,
      dataAtualizacao: now,
      mensagens: [
        {
          id: '1',
          texto: newTicket.descricao,
          autor: 'cliente',
          nomeAutor: 'Você',
          data: now,
        },
      ],
      sla: {
        primeiraResposta: {
          prazo: new Date(now.getTime() + prazos.primeiraResposta * 60 * 60 * 1000),
          cumprido: false,
        },
        resolucao: {
          prazo: new Date(now.getTime() + prazos.resolucao * 60 * 60 * 1000),
          cumprido: false,
        },
      },
    };

    setTickets([ticket, ...tickets]);
    setOpenNewTicket(false);
    setNewTicket({ titulo: '', categoria: 'duvida', prioridade: 'media', descricao: '' });
    setSelectedTicket(ticket);
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;

    const message: TicketMessage = {
      id: Date.now().toString(),
      texto: newMessage,
      autor: 'cliente',
      nomeAutor: 'Você',
      data: new Date(),
    };

    const updatedTicket = {
      ...selectedTicket,
      mensagens: [...selectedTicket.mensagens, message],
      dataAtualizacao: new Date(),
    };

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
    setNewMessage('');
  };

  const stats = {
    total: tickets.length,
    abertos: tickets.filter((t) => t.status === 'aberto').length,
    emAndamento: tickets.filter((t) => t.status === 'em_andamento').length,
    resolvidos: tickets.filter((t) => t.status === 'resolvido').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Tickets de Suporte
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Abra e acompanhe seus chamados de suporte.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenNewTicket(true)}
        >
          Novo Ticket
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {stats.abertos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Abertos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {stats.emAndamento}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Em Andamento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {stats.resolvidos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolvidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Lista de Tickets */}
        <Grid item xs={12} lg={selectedTicket ? 5 : 12}>
          <Card>
            <CardContent>
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{ mb: 2 }}
              >
                <Tab label="Todos" />
                <Tab label="Ativos" />
                <Tab label="Finalizados" />
              </Tabs>

              {/* Filtros */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Buscar ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="aberto">Aberto</MenuItem>
                    <MenuItem value="em_andamento">Em Andamento</MenuItem>
                    <MenuItem value="aguardando_cliente">Aguardando</MenuItem>
                    <MenuItem value="resolvido">Resolvido</MenuItem>
                    <MenuItem value="fechado">Fechado</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Lista */}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>SLA</TableCell>
                      <TableCell>Prioridade</TableCell>
                      <TableCell>Atualizado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        hover
                        onClick={() => setSelectedTicket(ticket)}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: selectedTicket?.id === ticket.id 
                            ? alpha(theme.palette.primary.main, 0.08) 
                            : 'transparent',
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {ticket.numero}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                              {ticket.titulo}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(ticket.status)}
                            label={getStatusLabel(ticket.status)}
                            size="small"
                            color={getStatusColor(ticket.status)}
                          />
                        </TableCell>
                        <TableCell>
                          {!['resolvido', 'fechado'].includes(ticket.status) ? (
                            <SlaIndicator sla={ticket.sla.resolucao} label="Resolução" />
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {ticket.avaliacao ? (
                                <>
                                  <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                  <Typography variant="caption" color="warning.main">
                                    {ticket.avaliacao}/5
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  Concluído
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.prioridade}
                            size="small"
                            color={getPrioridadeColor(ticket.prioridade)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {ticket.dataAtualizacao.toLocaleDateString('pt-BR')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTickets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            Nenhum ticket encontrado
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Detalhes do Ticket */}
        {selectedTicket && (
          <Grid item xs={12} lg={7}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {selectedTicket.numero}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedTicket.titulo}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(selectedTicket.status)}
                      label={getStatusLabel(selectedTicket.status)}
                      color={getStatusColor(selectedTicket.status)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Info />}
                      label={getCategoriaLabel(selectedTicket.categoria)}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<PriorityHigh />}
                      label={`Prioridade: ${selectedTicket.prioridade}`}
                      size="small"
                      color={getPrioridadeColor(selectedTicket.prioridade)}
                      variant="outlined"
                    />
                    <Chip
                      icon={<CalendarMonth />}
                      label={`Criado: ${selectedTicket.dataCriacao.toLocaleDateString('pt-BR')}`}
                      size="small"
                      variant="outlined"
                    />
                    {selectedTicket.atendente && (
                      <Chip
                        icon={<PersonOutline />}
                        label={selectedTicket.atendente}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {selectedTicket.status === 'resolvido' && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="success" />
                          <Typography variant="body2" fontWeight={600}>
                            Ticket resolvido
                          </Typography>
                        </Box>
                        {selectedTicket.avaliacao ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">Sua avaliação:</Typography>
                            <Rating value={selectedTicket.avaliacao} readOnly size="small" />
                          </Box>
                        ) : (
                          <Button size="small" onClick={() => setOpenRating(true)}>
                            Avaliar atendimento
                          </Button>
                        )}
                      </Box>
                      {selectedTicket.comentarioAvaliacao && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          "{selectedTicket.comentarioAvaliacao}"
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* SLA Info para tickets não resolvidos */}
                  {!['resolvido', 'fechado'].includes(selectedTicket.status) && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      bgcolor: alpha(theme.palette.info.main, 0.05), 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.info.main, 0.2),
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule fontSize="small" />
                        SLA do Ticket
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Primeira Resposta
                            </Typography>
                            <SlaIndicator sla={selectedTicket.sla.primeiraResposta} label="" />
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Resolução
                            </Typography>
                            <SlaIndicator sla={selectedTicket.sla.resolucao} label="" />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Mensagens */}
                <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
                  <List>
                    {selectedTicket.mensagens.map((msg) => (
                      <ListItem
                        key={msg.id}
                        alignItems="flex-start"
                        sx={{
                          flexDirection: msg.autor === 'cliente' ? 'row-reverse' : 'row',
                          gap: 1,
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: msg.autor === 'cliente' 
                                ? 'primary.main' 
                                : alpha(theme.palette.success.main, 0.8),
                              fontSize: 14,
                            }}
                          >
                            {msg.nomeAutor.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <Paper
                          sx={{
                            p: 1.5,
                            maxWidth: '70%',
                            bgcolor: msg.autor === 'cliente'
                              ? alpha(theme.palette.primary.main, 0.08)
                              : 'background.default',
                          }}
                        >
                          <Typography variant="caption" fontWeight={600}>
                            {msg.nomeAutor}
                          </Typography>
                          <Typography variant="body2">{msg.texto}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {msg.data.toLocaleString('pt-BR')}
                          </Typography>
                        </Paper>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Input */}
                {!['resolvido', 'fechado'].includes(selectedTicket.status) && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary">
                      <AttachFile />
                    </IconButton>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                      }}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Dialog Novo Ticket */}
      <Dialog open={openNewTicket} onClose={() => setOpenNewTicket(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Abrir Novo Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Título"
              fullWidth
              value={newTicket.titulo}
              onChange={(e) => setNewTicket({ ...newTicket, titulo: e.target.value })}
              placeholder="Descreva brevemente o assunto"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={newTicket.categoria}
                    label="Categoria"
                    onChange={(e) => setNewTicket({ ...newTicket, categoria: e.target.value })}
                  >
                    <MenuItem value="duvida">Dúvida</MenuItem>
                    <MenuItem value="problema">Problema</MenuItem>
                    <MenuItem value="solicitacao">Solicitação</MenuItem>
                    <MenuItem value="sugestao">Sugestão</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Prioridade</InputLabel>
                  <Select
                    value={newTicket.prioridade}
                    label="Prioridade"
                    onChange={(e) => setNewTicket({ ...newTicket, prioridade: e.target.value })}
                  >
                    <MenuItem value="baixa">Baixa</MenuItem>
                    <MenuItem value="media">Média</MenuItem>
                    <MenuItem value="alta">Alta</MenuItem>
                    <MenuItem value="urgente">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={4}
              value={newTicket.descricao}
              onChange={(e) => setNewTicket({ ...newTicket, descricao: e.target.value })}
              placeholder="Descreva detalhadamente sua solicitação..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTicket(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreateTicket}
            disabled={!newTicket.titulo || !newTicket.descricao}
          >
            Criar Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Avaliação */}
      <Dialog open={openRating} onClose={() => setOpenRating(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star color="warning" />
            Avaliar Atendimento
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom>
                Como você avalia o atendimento deste ticket?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedTicket?.atendente ? `Atendido por ${selectedTicket.atendente}` : 'Avalie o suporte recebido'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Rating
                  value={rating}
                  onChange={(_, value) => setRating(value)}
                  size="large"
                  sx={{ fontSize: 48 }}
                />
                {rating && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {rating === 1 && 'Muito insatisfeito'}
                    {rating === 2 && 'Insatisfeito'}
                    {rating === 3 && 'Neutro'}
                    {rating === 4 && 'Satisfeito'}
                    {rating === 5 && 'Muito satisfeito'}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <TextField
              label="Deixe um comentário (opcional)"
              multiline
              rows={3}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Conte-nos como foi sua experiência..."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenRating(false);
            setRating(null);
            setRatingComment('');
          }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedTicket && rating) {
                const updated = { 
                  ...selectedTicket, 
                  avaliacao: rating,
                  comentarioAvaliacao: ratingComment || undefined,
                };
                setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)));
                setSelectedTicket(updated);
              }
              setOpenRating(false);
              setRating(null);
              setRatingComment('');
            }}
            disabled={!rating}
          >
            Enviar Avaliação
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketsPage;
