import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Tooltip,
  alpha,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  History,
  Download,
  Visibility,
  TrendingUp,
  Receipt,
  AttachMoney,
  Pix,
  CreditCard,
  AccountBalance,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TipoGuia } from '../../../types';
import guiasService from '../../../services/guiasService';

interface HistoricoPagamentosDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Pagamento {
  id: string;
  guiaId: string;
  tipoGuia: TipoGuia;
  competencia: string;
  valor: number;
  dataPagamento: string;
  formaPagamento: 'pix' | 'boleto' | 'debito' | 'transferencia';
  comprovanteUrl?: string;
}

const tipoConfig: Record<TipoGuia, { label: string; color: string }> = {
  DAS: { label: 'DAS', color: '#2563eb' },
  ISS: { label: 'ISS', color: '#059669' },
  INSS: { label: 'INSS', color: '#d97706' },
  IRPJ: { label: 'IRPJ', color: '#7c3aed' },
  CSLL: { label: 'CSLL', color: '#db2777' },
  'PIS/COFINS': { label: 'PIS/COFINS', color: '#0891b2' },
  FGTS: { label: 'FGTS', color: '#ea580c' },
  obrigacao_acessoria: { label: 'Obrigação', color: '#6b7280' },
};

const formaPagamentoIcon: Record<string, React.ReactNode> = {
  pix: <Pix fontSize="small" />,
  boleto: <Receipt fontSize="small" />,
  debito: <CreditCard fontSize="small" />,
  transferencia: <AccountBalance fontSize="small" />,
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ pt: 2 }}>
    {value === index && children}
  </Box>
);

const HistoricoPagamentosDialog: React.FC<HistoricoPagamentosDialogProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar guias pagas da API
  const fetchPagamentos = useCallback(async () => {
    if (!open) return;
    setIsLoading(true);
    try {
      const response = await guiasService.findAll({ status: 'pago' as any, limit: 50 });
      const items = response.items || [];
      // Mapear guias pagas para pagamentos
      const mapped: Pagamento[] = items.map((guia: any) => ({
        id: guia.id,
        guiaId: guia.id,
        tipoGuia: guia.tipo || 'ISS',
        competencia: guia.competencia || '',
        valor: guia.valor || 0,
        dataPagamento: guia.dataPagamento || guia.updatedAt || new Date().toISOString(),
        formaPagamento: guia.formaPagamento || 'pix',
        comprovanteUrl: guia.comprovanteUrl,
      }));
      setPagamentos(mapped);
    } catch (err) {
      console.error('Erro ao carregar pagamentos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    fetchPagamentos();
  }, [fetchPagamentos]);

  // Calcular estatísticas
  const totalPago = pagamentos.reduce((sum, p) => sum + p.valor, 0);
  const totalPagamentos = pagamentos.length;
  const mediaPorPagamento = totalPagamentos > 0 ? totalPago / totalPagamentos : 0;

  // Agrupar por tipo de guia para gráfico de pizza
  const dadosPorTipo = Object.entries(
    pagamentos.reduce((acc, p) => {
      acc[p.tipoGuia] = (acc[p.tipoGuia] || 0) + p.valor;
      return acc;
    }, {} as Record<string, number>)
  ).map(([tipo, valor]) => ({
    name: tipo,
    value: valor,
    color: tipoConfig[tipo as TipoGuia]?.color || '#6b7280',
  }));

  // Agrupar por mês para gráfico de barras
  const dadosPorMes = [
    { mes: 'Set', valor: pagamentos.filter(p => p.competencia.startsWith('09')).reduce((s, p) => s + p.valor, 0) },
    { mes: 'Out', valor: pagamentos.filter(p => p.competencia.startsWith('10')).reduce((s, p) => s + p.valor, 0) },
    { mes: 'Nov', valor: pagamentos.filter(p => p.competencia.startsWith('11')).reduce((s, p) => s + p.valor, 0) },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <History sx={{ fontSize: 28, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Histórico de Pagamentos
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
        <>
        {/* Cards de Resumo */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card 
              variant="outlined" 
              sx={{ 
                bgcolor: alpha(theme.palette.success.main, 0.04),
                borderColor: alpha(theme.palette.success.main, 0.2)
              }}
            >
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AttachMoney sx={{ fontSize: 20, color: 'success.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Total Pago (3 meses)
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {formatCurrency(totalPago)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card 
              variant="outlined"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderColor: alpha(theme.palette.primary.main, 0.2)
              }}
            >
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Receipt sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Guias Pagas
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {totalPagamentos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card 
              variant="outlined"
              sx={{ 
                bgcolor: alpha(theme.palette.info.main, 0.04),
                borderColor: alpha(theme.palette.info.main, 0.2)
              }}
            >
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUp sx={{ fontSize: 20, color: 'info.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Média por Guia
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="info.main">
                  {formatCurrency(mediaPorPagamento)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Lista de Pagamentos" />
            <Tab label="Análise Gráfica" />
          </Tabs>
        </Box>

        {/* Tab: Lista */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Competência</TableCell>
                  <TableCell>Data Pagamento</TableCell>
                  <TableCell>Forma</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id} hover>
                    <TableCell>
                      <Chip
                        label={tipoConfig[pagamento.tipoGuia]?.label || pagamento.tipoGuia}
                        size="small"
                        sx={{
                          bgcolor: tipoConfig[pagamento.tipoGuia]?.color,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{pagamento.competencia}</TableCell>
                    <TableCell>
                      {format(parseISO(pagamento.dataPagamento), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formaPagamentoIcon[pagamento.formaPagamento]}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {pagamento.formaPagamento}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(pagamento.valor)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver Comprovante">
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small">
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab: Gráficos */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Gráfico de Barras - Por Mês */}
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Pagamentos por Mês
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosPorMes}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value), 'Valor']}
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="valor" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Gráfico de Pizza - Por Tipo */}
            <Grid item xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Distribuição por Tipo de Guia
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosPorTipo}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {dadosPorTipo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value), 'Valor']}
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                {/* Legenda */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, justifyContent: 'center' }}>
                  {dadosPorTipo.map((item) => (
                    <Chip
                      key={item.name}
                      label={`${item.name}: ${formatCurrency(item.value)}`}
                      size="small"
                      sx={{ bgcolor: item.color, color: 'white' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" startIcon={<Download />}>
          Exportar Relatório
        </Button>
        <Button variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoricoPagamentosDialog;
