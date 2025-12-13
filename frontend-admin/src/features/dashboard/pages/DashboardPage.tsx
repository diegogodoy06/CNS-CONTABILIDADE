import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Business,
  TrendingUp,
  TrendingDown,
  Receipt,
  Warning,
  CheckCircle,
  Schedule,
  MoreVert,
  Visibility,
  ArrowForward,
  AttachMoney,
  Assignment,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data
const metricas = {
  totalClientes: 52,
  clientesAtivos: 47,
  clientesInadimplentes: 3,
  clientesBloqueados: 2,
  guiasVencendo: 12,
  guiasVencidas: 4,
  ticketsAbertos: 8,
  notasHoje: 23,
  notasMes: 487,
  faturamentoMes: 2847650.00,
  faturamentoMesAnterior: 2654320.00,
};

const faturamentoSemanal = Array.from({ length: 7 }, (_, i) => ({
  data: format(subDays(new Date(), 6 - i), 'dd/MM'),
  valor: Math.floor(Math.random() * 150000) + 50000,
  notas: Math.floor(Math.random() * 30) + 10,
}));

const clientesPorRegime = [
  { name: 'Simples Nacional', value: 32, color: '#2e7d32' },
  { name: 'Lucro Presumido', value: 15, color: '#1976d2' },
  { name: 'Lucro Real', value: 5, color: '#9c27b0' },
];

const alertasRecentes = [
  { id: 1, tipo: 'critico', titulo: 'ISS vencendo hoje', cliente: 'Tech Solutions LTDA', tempo: '2h' },
  { id: 2, tipo: 'critico', titulo: '3 guias FGTS vencidas', cliente: 'Comércio ABC ME', tempo: '4h' },
  { id: 3, tipo: 'importante', titulo: 'Certificado expira em 5 dias', cliente: 'Serviços XYZ LTDA', tempo: '6h' },
  { id: 4, tipo: 'importante', titulo: 'Ticket sem resposta há 24h', cliente: 'Indústria 123', tempo: '1d' },
  { id: 5, tipo: 'informativo', titulo: 'Novo documento enviado', cliente: 'Consultoria DEF', tempo: '1d' },
];

const atividadesRecentes = [
  { id: 1, tipo: 'nota', descricao: 'NFS-e #1234 emitida', cliente: 'Tech Solutions', valor: 15000, tempo: '5min' },
  { id: 2, tipo: 'guia', descricao: 'ISS Dezembro pago', cliente: 'Comércio ABC', valor: 850, tempo: '15min' },
  { id: 3, tipo: 'documento', descricao: 'Contrato social enviado', cliente: 'Serviços XYZ', tempo: '30min' },
  { id: 4, tipo: 'ticket', descricao: 'Ticket #89 aberto', cliente: 'Indústria 123', tempo: '1h' },
  { id: 5, tipo: 'nota', descricao: 'NFS-e #1233 emitida', cliente: 'Consultoria DEF', valor: 8500, tempo: '2h' },
];

const clientesComPendencias = [
  { id: '1', nome: 'Tech Solutions LTDA', guiasPendentes: 2, ticketsAbertos: 1, status: 'ativo' },
  { id: '2', nome: 'Comércio ABC ME', guiasPendentes: 4, ticketsAbertos: 0, status: 'inadimplente' },
  { id: '3', nome: 'Serviços XYZ LTDA', guiasPendentes: 1, ticketsAbertos: 2, status: 'ativo' },
  { id: '4', nome: 'Indústria 123 LTDA', guiasPendentes: 0, ticketsAbertos: 3, status: 'ativo' },
  { id: '5', nome: 'Consultoria DEF', guiasPendentes: 3, ticketsAbertos: 1, status: 'inadimplente' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const DashboardPage = () => {
  const variacao = ((metricas.faturamentoMes - metricas.faturamentoMesAnterior) / metricas.faturamentoMesAnterior) * 100;

  const getAlertaColor = (tipo: string) => {
    switch (tipo) {
      case 'critico': return 'error';
      case 'importante': return 'warning';
      default: return 'info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'inadimplente': return 'warning';
      case 'bloqueado': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão geral do escritório • {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<FilterList />} variant="outlined">
            Filtros
          </Button>
          <Button startIcon={<Refresh />} variant="contained">
            Atualizar
          </Button>
        </Box>
      </Box>

      {/* Métricas principais */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Clientes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Clientes Ativos
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {metricas.clientesAtivos}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    de {metricas.totalClientes} empresas
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                  <Business />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(metricas.clientesAtivos / metricas.totalClientes) * 100}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Faturamento */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Faturamento do Mês
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(metricas.faturamentoMes)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    {variacao >= 0 ? (
                      <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: variacao >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}
                    >
                      {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}% vs mês anterior
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notas emitidas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notas Emitidas (Mês)
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {metricas.notasMes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metricas.notasHoje} hoje
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                  <Receipt />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: metricas.guiasVencidas > 0 ? 'error.50' : 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pendências
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {metricas.guiasVencendo + metricas.ticketsAbertos}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={`${metricas.guiasVencendo} guias`}
                      size="small"
                      color="warning"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Chip
                      label={`${metricas.ticketsAbertos} tickets`}
                      size="small"
                      color="info"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', width: 48, height: 48 }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos e Listas */}
      <Grid container spacing={3}>
        {/* Gráfico de Faturamento */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Faturamento Semanal
                </Typography>
                <Chip label="Últimos 7 dias" size="small" variant="outlined" />
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={faturamentoSemanal}>
                    <defs>
                      <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="data" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="valor"
                      stroke="#1e3a5f"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorFaturamento)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribuição por Regime */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Clientes por Regime
              </Typography>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientesPorRegime}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {clientesPorRegime.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                {clientesPorRegime.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas Recentes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Alertas Recentes
                </Typography>
                <Button size="small" endIcon={<ArrowForward />}>
                  Ver todos
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {alertasRecentes.map((alerta) => (
                  <Paper
                    key={alerta.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: 4,
                      borderLeftColor: `${getAlertaColor(alerta.tipo)}.main`,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {alerta.titulo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alerta.cliente}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={alerta.tempo}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <IconButton size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Atividades Recentes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Atividades Recentes
                </Typography>
                <Button size="small" endIcon={<ArrowForward />}>
                  Ver todas
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {atividadesRecentes.map((atividade, index) => (
                  <Box
                    key={atividade.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      pb: index < atividadesRecentes.length - 1 ? 1.5 : 0,
                      borderBottom: index < atividadesRecentes.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor:
                          atividade.tipo === 'nota' ? 'primary.light' :
                          atividade.tipo === 'guia' ? 'success.light' :
                          atividade.tipo === 'documento' ? 'info.light' : 'warning.light',
                      }}
                    >
                      {atividade.tipo === 'nota' ? <Receipt sx={{ fontSize: 18 }} /> :
                       atividade.tipo === 'guia' ? <CheckCircle sx={{ fontSize: 18 }} /> :
                       atividade.tipo === 'documento' ? <Assignment sx={{ fontSize: 18 }} /> :
                       <Schedule sx={{ fontSize: 18 }} />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {atividade.descricao}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {atividade.cliente} • {atividade.tempo}
                      </Typography>
                    </Box>
                    {atividade.valor && (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(atividade.valor)}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clientes com Pendências */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Clientes com Pendências
                </Typography>
                <Button size="small" endIcon={<ArrowForward />}>
                  Ver todos os clientes
                </Button>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell align="center">Guias Pendentes</TableCell>
                    <TableCell align="center">Tickets Abertos</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientesComPendencias.map((cliente) => (
                    <TableRow key={cliente.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                            {cliente.nome.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {cliente.nome}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {cliente.guiasPendentes > 0 ? (
                          <Chip
                            label={cliente.guiasPendentes}
                            size="small"
                            color={cliente.guiasPendentes > 2 ? 'error' : 'warning'}
                            sx={{ minWidth: 32 }}
                          />
                        ) : (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {cliente.ticketsAbertos > 0 ? (
                          <Chip
                            label={cliente.ticketsAbertos}
                            size="small"
                            color="info"
                            sx={{ minWidth: 32 }}
                          />
                        ) : (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={cliente.status === 'ativo' ? 'Ativo' : 'Inadimplente'}
                          size="small"
                          color={getStatusColor(cliente.status) as 'success' | 'warning' | 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalhes">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
