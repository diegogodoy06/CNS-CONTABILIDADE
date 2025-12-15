import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Assessment,
  AttachMoney,
  Business,
  Receipt,
  TrendingUp,
  TrendingDown,
  Download,
  Print,
  FilterList,
  DateRange,
  PictureAsPdf,
  TableChart,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Description,
  History,
  Schedule,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data
const faturamentoMensal = [
  { mes: 'Jul/25', valor: 2150000, notas: 420 },
  { mes: 'Ago/25', valor: 2380000, notas: 465 },
  { mes: 'Set/25', valor: 2290000, notas: 445 },
  { mes: 'Out/25', valor: 2520000, notas: 492 },
  { mes: 'Nov/25', valor: 2654320, notas: 518 },
  { mes: 'Dez/25', valor: 2847650, notas: 487 },
];

const faturamentoPorCliente = [
  { cliente: 'Indústria 123 LTDA', valor: 890000, porcentagem: 31.2 },
  { cliente: 'Serviços XYZ LTDA', valor: 520000, porcentagem: 18.3 },
  { cliente: 'Tech Solutions LTDA', valor: 385000, porcentagem: 13.5 },
  { cliente: 'Comércio ABC ME', valor: 245000, porcentagem: 8.6 },
  { cliente: 'Consultoria DEF', valor: 180000, porcentagem: 6.3 },
  { cliente: 'Outros', valor: 627650, porcentagem: 22.1 },
];

const clientesPorRegime = [
  { name: 'Simples Nacional', value: 32, color: '#4caf50' },
  { name: 'Lucro Presumido', value: 15, color: '#2196f3' },
  { name: 'Lucro Real', value: 5, color: '#9c27b0' },
];

const tributosMensais = [
  { mes: 'Jul/25', iss: 85000, irpj: 42000, csll: 18000, pis: 12000, cofins: 55000 },
  { mes: 'Ago/25', iss: 92000, irpj: 45000, csll: 19500, pis: 13000, cofins: 60000 },
  { mes: 'Set/25', iss: 88000, irpj: 43500, csll: 18800, pis: 12500, cofins: 57500 },
  { mes: 'Out/25', iss: 98000, irpj: 48000, csll: 20800, pis: 13800, cofins: 63500 },
  { mes: 'Nov/25', iss: 102000, irpj: 50500, csll: 21800, pis: 14500, cofins: 66800 },
  { mes: 'Dez/25', iss: 110000, irpj: 54000, csll: 23400, pis: 15500, cofins: 71500 },
];

const guiasStats = [
  { status: 'Pagas', quantidade: 245, valor: 485000 },
  { status: 'Pendentes', quantidade: 38, valor: 78500 },
  { status: 'Vencidas', quantidade: 12, valor: 24800 },
];

const relatoriosDisponiveis = [
  {
    id: '1',
    categoria: 'Faturamento',
    nome: 'Faturamento Consolidado',
    descricao: 'Relatório de faturamento de todos os clientes',
    icon: <AttachMoney />,
  },
  {
    id: '2',
    categoria: 'Faturamento',
    nome: 'Faturamento por Cliente',
    descricao: 'Detalhamento de faturamento por empresa',
    icon: <Business />,
  },
  {
    id: '3',
    categoria: 'Fiscal',
    nome: 'Notas Fiscais Emitidas',
    descricao: 'Listagem de todas as NFS-e emitidas',
    icon: <Receipt />,
  },
  {
    id: '4',
    categoria: 'Fiscal',
    nome: 'Tributos por Período',
    descricao: 'Relatório de tributos recolhidos',
    icon: <Assessment />,
  },
  {
    id: '5',
    categoria: 'Guias',
    nome: 'Guias Pendentes',
    descricao: 'Listagem de guias a vencer e vencidas',
    icon: <Schedule />,
  },
  {
    id: '6',
    categoria: 'Clientes',
    nome: 'Clientes por Regime',
    descricao: 'Distribuição de clientes por regime tributário',
    icon: <PieChartIcon />,
  },
  {
    id: '7',
    categoria: 'Operacional',
    nome: 'Tickets de Suporte',
    descricao: 'Métricas de atendimento e SLA',
    icon: <History />,
  },
  {
    id: '8',
    categoria: 'Auditoria',
    nome: 'Log de Ações',
    descricao: 'Registro de atividades do sistema',
    icon: <Description />,
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const RelatoriosPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [periodoInicio, setPeriodoInicio] = useState('2025-07-01');
  const [periodoFim, setPeriodoFim] = useState('2025-12-31');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  // Cálculos
  const totalFaturamento = faturamentoMensal.reduce((sum, m) => sum + m.valor, 0);
  const totalNotas = faturamentoMensal.reduce((sum, m) => sum + m.notas, 0);
  const mediaFaturamento = totalFaturamento / faturamentoMensal.length;
  const ultimoMes = faturamentoMensal[faturamentoMensal.length - 1];
  const mesAnterior = faturamentoMensal[faturamentoMensal.length - 2];
  const variacao = ((ultimoMes.valor - mesAnterior.valor) / mesAnterior.valor) * 100;

  const categorias = ['todos', ...new Set(relatoriosDisponiveis.map(r => r.categoria))];
  const relatoriosFiltrados = filtroCategoria === 'todos' 
    ? relatoriosDisponiveis 
    : relatoriosDisponiveis.filter(r => r.categoria === filtroCategoria);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Relatórios Gerenciais
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análises e métricas consolidadas do escritório
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            type="date"
            size="small"
            value={periodoInicio}
            onChange={(e) => setPeriodoInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            label="Início"
          />
          <TextField
            type="date"
            size="small"
            value={periodoFim}
            onChange={(e) => setPeriodoFim(e.target.value)}
            InputLabelProps={{ shrink: true }}
            label="Fim"
          />
          <Button startIcon={<Download />} variant="outlined">
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<BarChartIcon />} label="Dashboard" iconPosition="start" />
          <Tab icon={<AttachMoney />} label="Faturamento" iconPosition="start" />
          <Tab icon={<Assessment />} label="Tributos" iconPosition="start" />
          <Tab icon={<Description />} label="Relatórios" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Dashboard Geral */}
      {activeTab === 0 && (
        <>
          {/* Cards de métricas */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Faturamento Total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatCurrency(totalFaturamento)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Últimos 6 meses
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'success.light' }}>
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
                      <Typography variant="body2" color="text.secondary">
                        Faturamento do Mês
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatCurrency(ultimoMes.valor)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {variacao >= 0 ? (
                          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                        )}
                        <Typography variant="caption" color={variacao >= 0 ? 'success.main' : 'error.main'}>
                          {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
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
                      <Typography variant="body2" color="text.secondary">
                        Total de Notas
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {totalNotas.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        NFS-e emitidas
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.light' }}>
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
                      <Typography variant="body2" color="text.secondary">
                        Média Mensal
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatCurrency(mediaFaturamento)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Faturamento médio
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                      <Assessment />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Evolução do Faturamento</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={faturamentoMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`} />
                      <RechartsTooltip formatter={(value: number) => [formatCurrency(value), 'Valor']} />
                      <Area type="monotone" dataKey="valor" stroke="#1976d2" fill="#1976d2" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Clientes por Regime</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clientesPorRegime}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${value}`}
                      >
                        {clientesPorRegime.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Top 6 Clientes por Faturamento</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={faturamentoPorCliente} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                      <YAxis type="category" dataKey="cliente" width={150} />
                      <RechartsTooltip formatter={(value: number) => [formatCurrency(value), 'Faturamento']} />
                      <Bar dataKey="valor" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Faturamento Detalhado */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Faturamento Mensal Detalhado</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mês</TableCell>
                        <TableCell align="right">Valor Faturado</TableCell>
                        <TableCell align="right">Notas Emitidas</TableCell>
                        <TableCell align="right">Ticket Médio</TableCell>
                        <TableCell align="right">Variação</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {faturamentoMensal.map((mes, index) => {
                        const anterior = index > 0 ? faturamentoMensal[index - 1].valor : mes.valor;
                        const var_ = ((mes.valor - anterior) / anterior) * 100;
                        return (
                          <TableRow key={mes.mes}>
                            <TableCell>{mes.mes}</TableCell>
                            <TableCell align="right">{formatCurrency(mes.valor)}</TableCell>
                            <TableCell align="right">{mes.notas}</TableCell>
                            <TableCell align="right">{formatCurrency(mes.valor / mes.notas)}</TableCell>
                            <TableCell align="right">
                              {index > 0 && (
                                <Chip
                                  size="small"
                                  icon={var_ >= 0 ? <TrendingUp /> : <TrendingDown />}
                                  label={`${var_ >= 0 ? '+' : ''}${var_.toFixed(1)}%`}
                                  color={var_ >= 0 ? 'success' : 'error'}
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Faturamento por Cliente</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Cliente</TableCell>
                        <TableCell align="right">Faturamento</TableCell>
                        <TableCell align="right">% do Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {faturamentoPorCliente.map((cliente) => (
                        <TableRow key={cliente.cliente}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Business fontSize="small" color="action" />
                              {cliente.cliente}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{formatCurrency(cliente.valor)}</TableCell>
                          <TableCell align="right">
                            <Chip label={`${cliente.porcentagem}%`} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tributos */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Evolução de Tributos por Tipo</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={tributosMensais}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <RechartsTooltip formatter={(value: number) => [formatCurrency(value), '']} />
                    <Legend />
                    <Line type="monotone" dataKey="iss" name="ISS" stroke="#1976d2" strokeWidth={2} />
                    <Line type="monotone" dataKey="irpj" name="IRPJ" stroke="#f44336" strokeWidth={2} />
                    <Line type="monotone" dataKey="csll" name="CSLL" stroke="#ff9800" strokeWidth={2} />
                    <Line type="monotone" dataKey="pis" name="PIS" stroke="#4caf50" strokeWidth={2} />
                    <Line type="monotone" dataKey="cofins" name="COFINS" stroke="#9c27b0" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Situação das Guias</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Quantidade</TableCell>
                        <TableCell align="right">Valor Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {guiasStats.map((item) => (
                        <TableRow key={item.status}>
                          <TableCell>
                            <Chip
                              label={item.status}
                              size="small"
                              color={
                                item.status === 'Pagas' ? 'success' :
                                item.status === 'Pendentes' ? 'warning' : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell align="right">{item.quantidade}</TableCell>
                          <TableCell align="right">{formatCurrency(item.valor)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total de Tributos por Mês (Dez/25)</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { tributo: 'ISS', valor: 110000 },
                    { tributo: 'COFINS', valor: 71500 },
                    { tributo: 'IRPJ', valor: 54000 },
                    { tributo: 'CSLL', valor: 23400 },
                    { tributo: 'PIS', valor: 15500 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tributo" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <RechartsTooltip formatter={(value: number) => [formatCurrency(value), 'Valor']} />
                    <Bar dataKey="valor" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Lista de Relatórios */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Categorias
                </Typography>
                <List dense>
                  {categorias.map((cat) => (
                    <ListItemButton
                      key={cat}
                      selected={filtroCategoria === cat}
                      onClick={() => setFiltroCategoria(cat)}
                    >
                      <ListItemText 
                        primary={cat === 'todos' ? 'Todos os Relatórios' : cat} 
                      />
                      <Chip 
                        size="small" 
                        label={
                          cat === 'todos' 
                            ? relatoriosDisponiveis.length 
                            : relatoriosDisponiveis.filter(r => r.categoria === cat).length
                        } 
                      />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {relatoriosFiltrados.map((relatorio) => (
                <Grid item xs={12} sm={6} key={relatorio.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {relatorio.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {relatorio.nome}
                          </Typography>
                          <Chip 
                            label={relatorio.categoria} 
                            size="small" 
                            variant="outlined" 
                            sx={{ mb: 1 }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            {relatorio.descricao}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<PictureAsPdf />}>
                          PDF
                        </Button>
                        <Button size="small" startIcon={<TableChart />}>
                          Excel
                        </Button>
                        <Button size="small" startIcon={<Print />}>
                          Imprimir
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RelatoriosPage;
