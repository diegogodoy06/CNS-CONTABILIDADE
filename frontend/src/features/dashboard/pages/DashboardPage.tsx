import React, { useState } from 'react';
import {
  Box,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tooltip,
  Paper,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  AttachMoney,
  Warning,
  Description,
  Add,
  Upload,
  People,
  ChevronRight,
  CalendarToday,
  Error as ErrorIcon,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, addDays, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Guia, GuiaStatus, NotaFiscal, Document as DocType } from '../../../types';

// Mock data for demonstration
const mockStats = {
  notasEmitidas: { total: 142, variacao: 12 },
  faturamento: { total: 84320, variacao: 5.2 },
  pendencias: { guias: 3, documentos: 5, total: 8 },
};

const mockChartData = [
  { mes: 'Jul', notas: 98, faturamento: 62000 },
  { mes: 'Ago', notas: 112, faturamento: 71000 },
  { mes: 'Set', notas: 125, faturamento: 78000 },
  { mes: 'Out', notas: 108, faturamento: 68000 },
  { mes: 'Nov', notas: 135, faturamento: 82000 },
  { mes: 'Dez', notas: 142, faturamento: 84320 },
];

const mockGuias: Guia[] = [
  {
    id: '1',
    tipo: 'DAS',
    descricao: 'DAS - Simples Nacional',
    competencia: '11/2024',
    valor: 1250,
    dataVencimento: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    status: 'pendente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    tipo: 'FGTS',
    descricao: 'FGTS - Mensal',
    competencia: '11/2024',
    valor: 450,
    dataVencimento: format(addDays(new Date(), -3), 'yyyy-MM-dd'),
    status: 'vencida',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    tipo: 'INSS',
    descricao: 'GPS - INSS',
    competencia: '11/2024',
    valor: 320,
    dataVencimento: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    status: 'pendente',
    createdAt: new Date().toISOString(),
  },
];

const mockNotas: Partial<NotaFiscal>[] = [
  { id: '1', numero: 1023, tomador: { razaoSocial: 'Tech Solutions LTDA' } as any, valores: { valorServico: 4500 } as any, status: 'emitida', dataEmissao: format(addDays(new Date(), -2), 'yyyy-MM-dd') },
  { id: '2', numero: 1022, tomador: { razaoSocial: 'Consultoria Alpha S.A' } as any, valores: { valorServico: 2000 } as any, status: 'emitida', dataEmissao: format(addDays(new Date(), -5), 'yyyy-MM-dd') },
  { id: '3', numero: 1021, tomador: { razaoSocial: 'João Silva MEI' } as any, valores: { valorServico: 850 } as any, status: 'processando', dataEmissao: format(addDays(new Date(), -7), 'yyyy-MM-dd') },
];

const mockDocumentos: Partial<DocType>[] = [
  { id: '1', nome: 'Contrato Social_Consolidado.pdf', categoria: 'juridico', dataUpload: format(addDays(new Date(), -1), 'yyyy-MM-dd'), visualizado: false },
  { id: '2', nome: 'Balanço_Patrimonial_2024.xlsx', categoria: 'contabil', dataUpload: format(addDays(new Date(), -3), 'yyyy-MM-dd'), visualizado: true },
  { id: '3', nome: 'DAS_Novembro_2024.pdf', categoria: 'fiscal', dataUpload: format(addDays(new Date(), -5), 'yyyy-MM-dd'), visualizado: false },
];

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Stat Card Component
interface StatCardProps {
  title: string;
  subtitle: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'warning';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, subtitle, value, change, trend, icon }) => {
  const theme = useTheme();
  
  const trendColors = {
    up: theme.palette.success.main,
    down: theme.palette.error.main,
    warning: theme.palette.warning.main,
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, my: 0.5 }}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend === 'up' && <TrendingUp sx={{ fontSize: 16, color: trendColors.up }} />}
              {trend === 'down' && <TrendingDown sx={{ fontSize: 16, color: trendColors.down }} />}
              {trend === 'warning' && <Warning sx={{ fontSize: 16, color: trendColors.warning }} />}
              <Typography variant="caption" sx={{ color: trendColors[trend], fontWeight: 600 }}>
                {trend === 'warning' ? 'Atenção' : `${change > 0 ? '+' : ''}${change}%`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: trend === 'warning' ? 'warning.light' : 'primary.light',
              color: trend === 'warning' ? 'warning.main' : 'primary.main',
              opacity: 0.2,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Quick Action Card
interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, description, onClick, color }) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 2,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      transition: 'all 0.2s',
      '&:hover': {
        bgcolor: 'grey.50',
        transform: 'translateX(4px)',
      },
    }}
  >
    <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
      {icon}
    </Avatar>
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <ChevronRight color="action" />
  </Paper>
);

// Guide Status Badge
const GuiaStatusBadge: React.FC<{ status: Guia['status'] }> = ({ status }) => {
  const config: Record<GuiaStatus, { label: string; color: 'warning' | 'error' | 'success' | 'info' | 'default' }> = {
    pendente: { label: 'Pendente', color: 'warning' as const },
    vencida: { label: 'Vencida', color: 'error' as const },
    paga: { label: 'Paga', color: 'success' as const },
    parcelada: { label: 'Parcelada', color: 'info' as const },
    cancelada: { label: 'Cancelada', color: 'default' as const },
  };
  
  const { label, color } = config[status] || config.pendente;
  
  return (
    <Chip
      label={label}
      size="small"
      color={color}
      sx={{ fontWeight: 600, fontSize: '0.65rem' }}
    />
  );
};

// Nota Status Badge
const NotaStatusBadge: React.FC<{ status: NotaFiscal['status'] }> = ({ status }) => {
  const config = {
    rascunho: { label: 'Rascunho', color: 'default' as const },
    simulada: { label: 'Simulada', color: 'info' as const },
    processando: { label: 'Processando', color: 'warning' as const },
    emitida: { label: 'Emitida', color: 'success' as const },
    cancelada: { label: 'Cancelada', color: 'error' as const },
    erro: { label: 'Erro', color: 'error' as const },
  };
  
  const { label, color } = config[status] || config.rascunho;
  
  return (
    <Chip
      label={label}
      size="small"
      color={color}
      sx={{ fontWeight: 600, fontSize: '0.65rem' }}
    />
  );
};

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const getDaysUntilDue = (dateStr: string): number => {
    return differenceInDays(parseISO(dateStr), new Date());
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Painel de Controle
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão geral da operação contábil
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Última atualização: {format(lastUpdate, "HH:mm", { locale: ptBR })}
          </Typography>
          <Tooltip title="Atualizar">
            <IconButton size="small" onClick={() => setLastUpdate(new Date())}>
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Notas Emitidas"
            subtitle="vs mês anterior"
            value={mockStats.notasEmitidas.total.toString()}
            change={mockStats.notasEmitidas.variacao}
            trend="up"
            icon={<Receipt sx={{ fontSize: 32 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Faturamento"
            subtitle="estimado"
            value={formatCurrency(mockStats.faturamento.total)}
            change={mockStats.faturamento.variacao}
            trend="up"
            icon={<AttachMoney sx={{ fontSize: 32 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Pendências"
            subtitle="guias e docs"
            value={mockStats.pendencias.total.toString()}
            change={0}
            trend="warning"
            icon={<Warning sx={{ fontSize: 32 }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Chart + Guides */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Faturamento Chart */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Evolução do Faturamento
                </Typography>
                <Chip label="Últimos 6 meses" size="small" />
              </Box>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="mes" stroke={theme.palette.text.secondary} fontSize={12} />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                  />
                  <Area
                    type="monotone"
                    dataKey="faturamento"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFaturamento)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Próximas Obrigações */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="action" fontSize="small" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Próximas Obrigações
                  </Typography>
                </Box>
                <Button size="small" onClick={() => navigate('/guias')}>
                  Ver todas
                </Button>
              </Box>
              <List disablePadding>
                {mockGuias.map((guia, index) => {
                  const daysUntil = getDaysUntilDue(guia.dataVencimento);
                  const isOverdue = daysUntil < 0;
                  const isUrgent = daysUntil >= 0 && daysUntil <= 3;
                  
                  return (
                    <React.Fragment key={guia.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 2,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'grey.50' },
                          borderRadius: 1,
                        }}
                        onClick={() => navigate(`/guias/${guia.id}`)}
                      >
                        <Box
                          sx={{
                            width: 4,
                            height: 48,
                            borderRadius: 1,
                            mr: 2,
                            bgcolor: isOverdue ? 'error.main' : isUrgent ? 'warning.main' : 'success.main',
                          }}
                        />
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {guia.descricao}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              Ref: {guia.competencia}
                            </Typography>
                          }
                        />
                        <Box sx={{ textAlign: 'right', mr: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(guia.valor)}
                          </Typography>
                          <Typography variant="caption" color={isOverdue ? 'error.main' : 'text.secondary'}>
                            {isOverdue
                              ? `Venceu há ${Math.abs(daysUntil)} dias`
                              : daysUntil === 0
                              ? 'Vence hoje'
                              : `Vence em ${daysUntil} dias`}
                          </Typography>
                        </Box>
                        <GuiaStatusBadge status={guia.status} />
                      </ListItem>
                      {index < mockGuias.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions + Recent Items */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3, bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Ações Rápidas
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', mb: 3 }}>
                Atalhos para suas rotinas diárias
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <QuickAction
                  icon={<Add />}
                  title="Emitir Nota Fiscal"
                  description="Criar nova NF-e"
                  onClick={() => navigate('/notas/emitir')}
                  color="primary"
                />
                <QuickAction
                  icon={<Upload />}
                  title="Enviar Documento"
                  description="Upload de arquivos"
                  onClick={() => navigate('/documentos?upload=true')}
                  color="secondary"
                />
                <QuickAction
                  icon={<People />}
                  title="Novo Tomador"
                  description="Cadastrar cliente"
                  onClick={() => navigate('/tomadores/novo')}
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Alert Card */}
          {mockGuias.some(g => g.status === 'vencida') && (
            <Card sx={{ mb: 3, bgcolor: 'error.light', border: '1px solid', borderColor: 'error.main' }}>
              <CardContent sx={{ display: 'flex', gap: 2 }}>
                <ErrorIcon sx={{ color: 'error.main' }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'error.dark', fontWeight: 600 }}>
                    Guia Vencida
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'error.dark' }}>
                    Você tem guias vencidas. Regularize para evitar multas.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Recent Notes */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Notas Recentes
                </Typography>
                <Button size="small" onClick={() => navigate('/notas')}>
                  Ver todas
                </Button>
              </Box>
              <List disablePadding>
                {mockNotas.map((nota, index) => (
                  <React.Fragment key={nota.id}>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              #{nota.numero}
                            </Typography>
                            <NotaStatusBadge status={nota.status!} />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {nota.tomador?.razaoSocial}
                          </Typography>
                        }
                      />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(nota.valores?.valorServico || 0)}
                      </Typography>
                    </ListItem>
                    {index < mockNotas.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Documentos Recentes
                </Typography>
                <Button size="small" onClick={() => navigate('/documentos')}>
                  Ver todos
                </Button>
              </Box>
              <List disablePadding>
                {mockDocumentos.map((doc, index) => (
                  <React.Fragment key={doc.id}>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Description color={doc.visualizado ? 'action' : 'primary'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: doc.visualizado ? 400 : 600,
                                maxWidth: 180,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {doc.nome}
                            </Typography>
                            {!doc.visualizado && (
                              <Chip label="Novo" size="small" color="primary" sx={{ height: 18, fontSize: '0.6rem' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {doc.categoria}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < mockDocumentos.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
