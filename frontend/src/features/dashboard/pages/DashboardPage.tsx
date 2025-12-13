import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  Receipt,
  Payment,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  ArrowForward,
  Add,
  Warning,
  FileDownload,
  Refresh,
  Tune,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';

// Componentes do Dashboard
import {
  GraficoFaturamento,
  GraficoImpostos,
  CentralNotificacoes,
  DocumentosRecentesWidget,
  AtalhosRapidosFAB,
  WidgetConfigDrawer,
} from '../components';

// Card Header Component
interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  color?: string;
}

const DashboardCardHeader: React.FC<CardHeaderProps> = ({
  icon,
  title,
  subtitle,
  action,
  color = 'primary.main',
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.primary.main, 0.03),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: color,
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {action}
    </Box>
  );
};

// Stats Item Component
interface StatItemProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: { value: number; positive: boolean };
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  sublabel,
  color = 'text.primary',
  trend,
}) => (
  <Box sx={{ textAlign: 'center', py: 2 }}>
    <Typography variant="h4" fontWeight={700} color={color}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    {trend && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
        {trend.positive ? (
          <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
        ) : (
          <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />
        )}
        <Typography
          variant="caption"
          color={trend.positive ? 'success.main' : 'error.main'}
        >
          {trend.value}%
        </Typography>
      </Box>
    )}
    {sublabel && (
      <Typography variant="caption" color="text.secondary">
        {sublabel}
      </Typography>
    )}
  </Box>
);

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: { value: number; positive: boolean };
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon, color, trend }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {trend && (
                <>
                  {trend.positive ? (
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                  )}
                  <Typography
                    variant="caption"
                    color={trend.positive ? 'success.main' : 'error.main'}
                    fontWeight={500}
                  >
                    {trend.value}%
                  </Typography>
                </>
              )}
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Dashboard
const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { company } = useAppSelector((state: RootState) => state.auth);
  const widgets = useAppSelector((state: RootState) => state.widgets.widgets);
  const [activeTab, setActiveTab] = useState(0);
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);

  // Widgets ordenados e filtrados por visibilidade
  const kpiWidgets = widgets
    .filter(w => w.size === 'small' && w.visible)
    .sort((a, b) => a.order - b.order);
  
  const mainWidgets = widgets
    .filter(w => w.size !== 'small' && w.visible)
    .sort((a, b) => a.order - b.order);

  // Mock data
  const notasFiscais = {
    emitidas: 12,
    pendentes: 3,
    valorTotal: 45678.90,
    variacao: 12,
  };

  const impostos = {
    pendentes: 2,
    pagos: 5,
    proximoVencimento: '20/01/2025',
    valorPendente: 1234.56,
    totalMes: 7586.00,
  };

  const obrigacoes = [
    { dia: 7, descricao: 'FGTS', status: 'pendente' },
    { dia: 15, descricao: 'INSS', status: 'pendente' },
    { dia: 20, descricao: 'DAS MEI', status: 'proximo' },
    { dia: 25, descricao: 'ISS', status: 'futuro' },
  ];

  const ultimasNotas = [
    { numero: '000123', tomador: 'Cliente ABC Ltda', valor: 5000, status: 'emitida' },
    { numero: '000122', tomador: 'Empresa XYZ', valor: 3500, status: 'emitida' },
    { numero: '000121', tomador: 'Tech Solutions', valor: 8900, status: 'cancelada' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Renderizador de KPI Cards
  const renderKpiCard = (widgetId: string) => {
    switch (widgetId) {
      case 'kpi-faturamento':
        return (
          <KPICard
            title="Faturamento do Mês"
            value={formatCurrency(notasFiscais.valorTotal)}
            subtitle="vs. mês anterior"
            icon={<TrendingUp />}
            color={theme.palette.success.main}
            trend={{ value: 12, positive: true }}
          />
        );
      case 'kpi-notas':
        return (
          <KPICard
            title="Notas Emitidas"
            value={notasFiscais.emitidas.toString()}
            subtitle="este mês"
            icon={<Receipt />}
            color={theme.palette.primary.main}
            trend={{ value: 8, positive: true }}
          />
        );
      case 'kpi-guias':
        return (
          <KPICard
            title="Impostos Pendentes"
            value={formatCurrency(impostos.valorPendente)}
            subtitle="próximo venc. 20/01"
            icon={<Payment />}
            color={theme.palette.warning.main}
          />
        );
      case 'kpi-impostos':
        return (
          <KPICard
            title="Total de Impostos"
            value={formatCurrency(impostos.totalMes)}
            subtitle="dezembro/2024"
            icon={<AccountBalance />}
            color={theme.palette.info.main}
            trend={{ value: 3, positive: false }}
          />
        );
      default:
        return null;
    }
  };

  // Renderizador de Widgets Principais
  const renderMainWidget = (widgetId: string, size: string) => {
    const gridSize = size === 'large' ? { xs: 12, lg: 8 } : { xs: 12, md: 6, lg: 4 };
    
    switch (widgetId) {
      case 'chart-faturamento':
        return (
          <Grid item {...gridSize} key={widgetId}>
            <Card sx={{ height: '100%' }}>
              <DashboardCardHeader
                icon={<TrendingUp />}
                title="Evolução Financeira"
                subtitle="Últimos 6 meses"
                color="success.main"
                action={
                  <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    sx={{ minHeight: 32 }}
                  >
                    <Tab label="Faturamento" sx={{ minHeight: 32, py: 0 }} />
                    <Tab label="Impostos" sx={{ minHeight: 32, py: 0 }} />
                  </Tabs>
                }
              />
              <CardContent>
                {activeTab === 0 ? <GraficoFaturamento /> : <GraficoImpostos />}
              </CardContent>
            </Card>
          </Grid>
        );
      case 'chart-impostos':
        return (
          <Grid item xs={12} lg={4} key={widgetId}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <CentralNotificacoes compacto />
              </CardContent>
            </Card>
          </Grid>
        );
      case 'widget-calendario':
        return (
          <Grid item xs={12} md={6} lg={4} key={widgetId}>
            <Card sx={{ height: '100%' }}>
              <DashboardCardHeader
                icon={<Payment />}
                title="Impostos"
                subtitle="Guias e tributos"
                color="warning.main"
                action={
                  <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/guias')}>
                    Ver todas
                  </Button>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <StatItem label="Pendentes" value={impostos.pendentes} color="warning.main" />
                  </Grid>
                  <Grid item xs={6}>
                    <StatItem label="Pagos este mês" value={impostos.pagos} color="success.main" />
                  </Grid>
                </Grid>
                <Box sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2, p: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="warning.main">Próximo vencimento</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={700}>{impostos.proximoVencimento}</Typography>
                  <Typography variant="body2" color="text.secondary">Valor: {formatCurrency(impostos.valorPendente)}</Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Calendário de obrigações</Typography>
                  {obrigacoes.map((obrigacao, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, borderBottom: index < obrigacoes.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: obrigacao.status === 'proximo' ? 'warning.main' : obrigacao.status === 'pendente' ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.grey[500], 0.1), color: obrigacao.status === 'proximo' ? '#fff' : obrigacao.status === 'pendente' ? 'error.main' : 'text.secondary', fontSize: '0.875rem', fontWeight: 600 }}>
                        {obrigacao.dia}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500}>{obrigacao.descricao}</Typography>
                        <Typography variant="caption" color="text.secondary">Dia {obrigacao.dia}/01</Typography>
                      </Box>
                      {obrigacao.status === 'proximo' && <Chip size="small" label="Próximo" color="warning" sx={{ height: 24 }} />}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      case 'widget-documentos':
        return (
          <Grid item xs={12} md={6} lg={4} key={widgetId}>
            <Card sx={{ height: '100%' }}>
              <DashboardCardHeader
                icon={<FileDownload />}
                title="Documentos"
                subtitle="Arquivos recentes"
                color="info.main"
                action={
                  <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/documentos')}>
                    Ver todos
                  </Button>
                }
              />
              <CardContent>
                <DocumentosRecentesWidget limite={5} />
              </CardContent>
            </Card>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Olá! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Confira o resumo da sua empresa {company?.nomeFantasia || 'Empresa Demo'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar dados">
            <IconButton size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Personalizar dashboard">
            <IconButton size="small" onClick={() => setShowWidgetConfig(true)}>
              <Tune />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* KPI Cards Row - Renderização dinâmica por ordem */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiWidgets.map((widget) => (
          <Grid item xs={12} sm={6} md={3} key={widget.id}>
            {renderKpiCard(widget.id)}
          </Grid>
        ))}
      </Grid>

      {/* Main Widgets - Renderização dinâmica por ordem */}
      <Grid container spacing={3}>
        {mainWidgets.map((widget) => renderMainWidget(widget.id, widget.size))}

        {/* Notas Fiscais Card - Fixo */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <DashboardCardHeader
              icon={<Receipt />}
              title="Notas Fiscais"
              subtitle="Dezembro 2024"
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/notas')}
                >
                  Ver todas
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <StatItem
                    label="Emitidas"
                    value={notasFiscais.emitidas}
                    color="success.main"
                    trend={{ value: 8, positive: true }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <StatItem
                    label="Pendentes"
                    value={notasFiscais.pendentes}
                    color="warning.main"
                  />
                </Grid>
                <Grid item xs={4}>
                  <StatItem
                    label="Total"
                    value={formatCurrency(notasFiscais.valorTotal).replace('R$', '')}
                    sublabel="faturado"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  onClick={() => navigate('/notas/emitir')}
                  sx={{ mb: 2 }}
                >
                  Emitir Nova Nota
                </Button>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Últimas notas emitidas
                </Typography>
                {ultimasNotas.map((nota, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1,
                      borderBottom: index < ultimasNotas.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        #{nota.numero}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {nota.tomador}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(nota.valor)}
                      </Typography>
                      <Chip
                        size="small"
                        label={nota.status}
                        color={nota.status === 'emitida' ? 'success' : 'error'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Row */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Precisa de ajuda?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nossa equipe está disponível para ajudar você com suas dúvidas
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: { md: 'flex-end' } }}>
                    <Button variant="outlined" onClick={() => navigate('/ajuda')}>
                      Central de Ajuda
                    </Button>
                    <Button variant="contained" onClick={() => navigate('/mensagens')}>
                      Falar com Contador
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAB de Ações Rápidas */}
      <AtalhosRapidosFAB />

      {/* Drawer de Configuração de Widgets */}
      <WidgetConfigDrawer 
        open={showWidgetConfig} 
        onClose={() => setShowWidgetConfig(false)} 
      />
    </Box>
  );
};

export default DashboardPage;
