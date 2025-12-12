import React from 'react';
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
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Receipt,
  Payment,
  AccountBalance,
  TrendingUp,
  ArrowForward,
  Add,
  Warning,
  MoreVert,
  CalendarMonth,
  FileDownload,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';

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
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
      bgcolor: alpha('#0066CC', 0.03),
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

// Stats Item Component
interface StatItemProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  sublabel,
  icon,
  color = 'text.primary',
}) => (
  <Box sx={{ textAlign: 'center', py: 2 }}>
    {icon && (
      <Box sx={{ mb: 1, color }}>
        {icon}
      </Box>
    )}
    <Typography variant="h4" fontWeight={700} color={color}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    {sublabel && (
      <Typography variant="caption" color="text.secondary">
        {sublabel}
      </Typography>
    )}
  </Box>
);

// Main Dashboard
const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { company } = useAppSelector((state: RootState) => state.auth);

  // Mock data
  const notasFiscais = {
    emitidas: 12,
    pendentes: 3,
    valorTotal: 45678.90,
  };

  const impostos = {
    pendentes: 2,
    pagos: 5,
    proximoVencimento: '20/01/2025',
    valorPendente: 1234.56,
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

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Olá! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Confira o resumo da sua empresa {company?.nomeFantasia || 'Empresa Demo'}
        </Typography>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Notas Fiscais Card */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <DashboardCardHeader
              icon={<Receipt />}
              title="Notas Fiscais"
              subtitle="Janeiro 2025"
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
                  onClick={() => navigate('/notas/nova')}
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

        {/* Impostos Card */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <DashboardCardHeader
              icon={<Payment />}
              title="Impostos"
              subtitle="Guias e tributos"
              color="warning.main"
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/guias')}
                >
                  Ver todas
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StatItem
                    label="Pendentes"
                    value={impostos.pendentes}
                    color="warning.main"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatItem
                    label="Pagos este mês"
                    value={impostos.pagos}
                    color="success.main"
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  borderRadius: 2,
                  p: 2,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" color="warning.main">
                    Próximo vencimento
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {impostos.proximoVencimento}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor: {formatCurrency(impostos.valorPendente)}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Calendário de obrigações
                </Typography>
                {obrigacoes.map((obrigacao, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1,
                      borderBottom: index < obrigacoes.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor:
                          obrigacao.status === 'proximo'
                            ? 'warning.main'
                            : obrigacao.status === 'pendente'
                            ? alpha(theme.palette.error.main, 0.1)
                            : alpha(theme.palette.grey[500], 0.1),
                        color:
                          obrigacao.status === 'proximo'
                            ? '#fff'
                            : obrigacao.status === 'pendente'
                            ? 'error.main'
                            : 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {obrigacao.dia}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {obrigacao.descricao}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Dia {obrigacao.dia}/01
                      </Typography>
                    </Box>
                    {obrigacao.status === 'proximo' && (
                      <Chip
                        size="small"
                        label="Próximo"
                        color="warning"
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Conta Digital / Pro-labore Card */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <DashboardCardHeader
              icon={<AccountBalance />}
              title="Financeiro"
              subtitle="Resumo do mês"
              color="success.main"
              action={
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              }
            />
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="overline" color="text.secondary">
                  Receita do mês
                </Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {formatCurrency(notasFiscais.valorTotal)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 18 }} />
                  <Typography variant="body2" color="success.main">
                    +12% em relação ao mês anterior
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Meta mensal
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    76%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={76}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  R$ 45.678,90 de R$ 60.000,00
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Ações rápidas
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<FileDownload />}
                      size="small"
                    >
                      Relatório
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<CalendarMonth />}
                      size="small"
                      onClick={() => navigate('/calendario')}
                    >
                      Agenda
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Box
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                  p: 2,
                  mt: 3,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Pró-labore do mês
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {formatCurrency(5500)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Previsão com base no faturamento atual
                </Typography>
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
                    <Button variant="contained">
                      Falar com Contador
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
