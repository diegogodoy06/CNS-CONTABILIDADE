import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
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
  Chip,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  TrendingUp,
  Receipt,
  AccountBalance,
  Assessment,
  CalendarMonth,
  FilterList,
  Refresh,
  Image as ImageIcon,
  ZoomIn,
  Close,
  Business,
  ReceiptLong,
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
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import relatoriosService from '../../../services/relatoriosService';
import { useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 24 }}>
    {value === index && children}
  </div>
);

// Tipos para os dados
interface FaturamentoMensal {
  mes: string;
  faturamento: number;
  impostos: number;
}

interface ImpostoPorTipo {
  name: string;
  value: number;
  color: string;
}

interface TopTomador {
  id: number;
  nome: string;
  cnpj: string;
  total: number;
  notas: number;
}

interface NotaPorStatus {
  name: string;
  value: number;
  color: string;
}

interface NotaDetalhe {
  numero: string;
  tomador: string;
  valor: number;
  data: string;
  status: string;
}

const RelatoriosPage: React.FC = () => {
  const theme = useTheme();
  const { company } = useAppSelector((state: RootState) => state.auth);
  
  // Estados para dados da API
  const [faturamentoMensal, setFaturamentoMensal] = useState<FaturamentoMensal[]>([]);
  const [impostosPorTipo, setImpostosPorTipo] = useState<ImpostoPorTipo[]>([]);
  const [topTomadores, setTopTomadores] = useState<TopTomador[]>([]);
  const [notasPorStatus, setNotasPorStatus] = useState<NotaPorStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tabValue, setTabValue] = useState(0);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('2025');
  const [competencia, setCompetencia] = useState('12/2025');
  
  // States para drill-down
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{
    titulo: string;
    mes: string;
    dados: NotaDetalhe[];
  } | null>(null);

  // Refs para exportação PNG
  const chartFaturamentoRef = useRef<HTMLDivElement>(null);
  const chartStatusRef = useRef<HTMLDivElement>(null);

  // Carregar dados da API
  const fetchDados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [faturamentoRes, impostosRes, notasRes] = await Promise.all([
        relatoriosService.getFaturamento({ empresaId: company?.id, ano: parseInt(periodoSelecionado) }),
        relatoriosService.getImpostos({ empresaId: company?.id, ano: parseInt(periodoSelecionado) }),
        relatoriosService.getNotasEmitidas({ empresaId: company?.id, ano: parseInt(periodoSelecionado) }),
      ]);
      
      // Mapear dados de faturamento
      if (faturamentoRes?.mensal) {
        setFaturamentoMensal(faturamentoRes.mensal.map((item: any) => ({
          mes: item.mes,
          faturamento: item.faturamento || 0,
          impostos: item.impostos || 0,
        })));
      }
      
      // Mapear dados de impostos por tipo
      if (impostosRes?.porTipo) {
        const cores = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];
        setImpostosPorTipo(impostosRes.porTipo.map((item: any, index: number) => ({
          name: item.tipo,
          value: item.valor || 0,
          color: cores[index % cores.length],
        })));
      }
      
      // Mapear top tomadores
      if (faturamentoRes?.topTomadores) {
        setTopTomadores(faturamentoRes.topTomadores.map((item: any, index: number) => ({
          id: index + 1,
          nome: item.nome || item.razaoSocial,
          cnpj: item.documento,
          total: item.faturamento || 0,
          notas: item.totalNotas || 0,
        })));
      }
      
      // Mapear notas por status
      if (notasRes?.porStatus) {
        setNotasPorStatus([
          { name: 'Emitidas', value: notasRes.porStatus.emitidas || 0, color: '#4caf50' },
          { name: 'Canceladas', value: notasRes.porStatus.canceladas || 0, color: '#f44336' },
          { name: 'Pendentes', value: notasRes.porStatus.pendentes || 0, color: '#ff9800' },
        ]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar relatórios:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dados dos relatórios');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, periodoSelecionado]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalFaturamento = useMemo(() => 
    faturamentoMensal.reduce((acc, item) => acc + item.faturamento, 0),
    [faturamentoMensal]
  );

  const totalImpostos = useMemo(() => 
    faturamentoMensal.reduce((acc, item) => acc + item.impostos, 0),
    [faturamentoMensal]
  );

  const handleExportPDF = () => {
    // Implementar exportação PDF
    console.log('Exportando PDF...');
  };

  const handleExportExcel = () => {
    // Implementar exportação Excel
    console.log('Exportando Excel...');
  };

  // Função para exportar gráfico como PNG (usando SVG nativo do Recharts)
  const handleExportPNG = useCallback(async (chartRef: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector('svg');
    if (!svg) return;

    try {
      // Clonar SVG para manipulação
      const clonedSvg = svg.cloneNode(true) as SVGElement;
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      
      // Criar canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Configurar dimensões com escala 2x para melhor qualidade
      const bbox = svg.getBoundingClientRect();
      canvas.width = bbox.width * 2;
      canvas.height = bbox.height * 2;
      
      img.onload = () => {
        if (ctx) {
          // Fundo branco
          ctx.fillStyle = theme.palette.background.paper;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
          
          // Download
          const link = document.createElement('a');
          link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      };
      
      img.onerror = () => {
        console.error('Erro ao carregar imagem SVG');
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Erro ao exportar PNG:', error);
    }
  }, [theme.palette.background.paper]);

  // Handler para drill-down ao clicar no gráfico
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBarClick = useCallback(async (data: any) => {
    if (data?.activePayload?.[0]?.payload) {
      const payload = data.activePayload[0].payload as { mes: string; faturamento: number };
      try {
        // Buscar notas do mês via API
        const mesIndex = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].indexOf(payload.mes) + 1;
        const notasRes = await relatoriosService.getNotasEmitidas({
          empresaId: company?.id,
          mes: mesIndex,
          ano: parseInt(periodoSelecionado),
        });
        
        const notas = (notasRes?.notas || []).map((n: any) => ({
          numero: n.numero,
          tomador: n.tomador?.razaoSocial || n.tomador?.nome || '-',
          valor: n.valor || 0,
          data: n.dataEmissao,
          status: n.status,
        }));
        
        setDrillDownData({
          titulo: `Detalhamento - ${payload.mes}/${periodoSelecionado}`,
          mes: payload.mes,
          dados: notas,
        });
        setDrillDownOpen(true);
      } catch (err) {
        console.error('Erro ao carregar notas do mês:', err);
      }
    }
  }, [company?.id, periodoSelecionado]);

  return (
    <Box>
      {/* Loading e Error */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Relatórios e Análises
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acompanhe seus indicadores e gere relatórios fiscais
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={handleExportPDF}
          >
            Exportar PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<TableChart />}
            onClick={handleExportExcel}
          >
            Exportar Excel
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FilterList color="action" />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Ano</InputLabel>
              <Select
                value={periodoSelecionado}
                label="Ano"
                onChange={(e) => setPeriodoSelecionado(e.target.value)}
              >
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Competência</InputLabel>
              <Select
                value={competencia}
                label="Competência"
                onChange={(e) => setCompetencia(e.target.value)}
              >
                <MenuItem value="12/2025">Dezembro/2025</MenuItem>
                <MenuItem value="11/2025">Novembro/2025</MenuItem>
                <MenuItem value="10/2025">Outubro/2025</MenuItem>
                <MenuItem value="09/2025">Setembro/2025</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="text"
              startIcon={<Refresh />}
              size="small"
            >
              Atualizar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Faturamento Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totalFaturamento)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +12.5% vs ano anterior
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1) 
                }}>
                  <Receipt sx={{ color: 'primary.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Impostos
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totalImpostos)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {((totalImpostos / totalFaturamento) * 100).toFixed(1)}% do faturamento
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.warning.main, 0.1) 
                }}>
                  <AccountBalance sx={{ color: 'warning.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notas Emitidas
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    176
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +8 vs mês anterior
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.success.main, 0.1) 
                }}>
                  <Assessment sx={{ color: 'success.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tomadores Ativos
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    42
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +5 novos este ano
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.info.main, 0.1) 
                }}>
                  <CalendarMonth sx={{ color: 'info.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Visão Geral" />
          <Tab label="Faturamento" />
          <Tab label="Impostos" />
          <Tab label="Tomadores" />
        </Tabs>

        {/* Tab: Visão Geral */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Gráfico de Faturamento x Impostos */}
              <Grid item xs={12} lg={8}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Faturamento vs Impostos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Evolução mensal do faturamento e tributos (clique para detalhes)
                    </Typography>
                  </Box>
                  <Tooltip title="Exportar como PNG">
                    <IconButton 
                      size="small" 
                      onClick={() => handleExportPNG(chartFaturamentoRef, 'faturamento_impostos')}
                    >
                      <ImageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ height: 350 }} ref={chartFaturamentoRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={faturamentoMensal}>
                      <defs>
                        <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorImpostos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.palette.warning.main} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="mes" stroke={theme.palette.text.secondary} />
                      <YAxis 
                        stroke={theme.palette.text.secondary}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="faturamento"
                        name="Faturamento"
                        stroke={theme.palette.primary.main}
                        fillOpacity={1}
                        fill="url(#colorFaturamento)"
                      />
                      <Area
                        type="monotone"
                        dataKey="impostos"
                        name="Impostos"
                        stroke={theme.palette.warning.main}
                        fillOpacity={1}
                        fill="url(#colorImpostos)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              {/* Gráfico de Pizza - Status das Notas */}
              <Grid item xs={12} lg={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Status das Notas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distribuição por status
                    </Typography>
                  </Box>
                  <Tooltip title="Exportar como PNG">
                    <IconButton 
                      size="small" 
                      onClick={() => handleExportPNG(chartStatusRef, 'status_notas')}
                    >
                      <ImageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ height: 350 }} ref={chartStatusRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={notasPorStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {notasPorStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Tab: Faturamento */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Detalhamento do Faturamento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faturamento mensal detalhado
              </Typography>
            </Box>

            {/* Gráfico de Barras - Clique para drill-down */}
            <Box sx={{ height: 400, mb: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faturamentoMensal} onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="mes" stroke={theme.palette.text.secondary} />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Bar 
                    dataKey="faturamento" 
                    name="Faturamento"
                    fill={theme.palette.primary.main} 
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                💡 Clique em uma barra para ver os detalhes das notas do período
              </Typography>
            </Box>

            {/* Tabela de Faturamento */}
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Mês</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Faturamento</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Impostos</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Líquido</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>% Tributos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {faturamentoMensal.map((row) => (
                    <TableRow key={row.mes} hover>
                      <TableCell>{row.mes}/{periodoSelecionado}</TableCell>
                      <TableCell align="right">{formatCurrency(row.faturamento)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.impostos)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.faturamento - row.impostos)}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={row.faturamento > 0 ? `${((row.impostos / row.faturamento) * 100).toFixed(1)}%` : '0%'}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatCurrency(totalFaturamento)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatCurrency(totalImpostos)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatCurrency(totalFaturamento - totalImpostos)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${((totalImpostos / totalFaturamento) * 100).toFixed(1)}%`}
                        size="small"
                        color="warning"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        {/* Tab: Impostos */}
        <TabPanel value={tabValue} index={2}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Gráfico de Pizza - Impostos por Tipo */}
              <Grid item xs={12} md={5}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Distribuição por Tributo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de tributos no período
                  </Typography>
                </Box>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impostosPorTipo}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {impostosPorTipo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              {/* Tabela de Impostos */}
              <Grid item xs={12} md={7}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Detalhamento de Tributos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Valores por tipo de imposto
                  </Typography>
                </Box>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Tributo</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Valor</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>% do Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {impostosPorTipo.map((imposto) => (
                        <TableRow key={imposto.name} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%', 
                                  bgcolor: imposto.color 
                                }} 
                              />
                              {imposto.name}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{formatCurrency(imposto.value)}</TableCell>
                          <TableCell align="right">
                            {impostosPorTipo.length > 0 ? ((imposto.value / impostosPorTipo.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1) : 0}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {formatCurrency(impostosPorTipo.reduce((a, b) => a + b.value, 0))}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Tab: Tomadores */}
        <TabPanel value={tabValue} index={3}>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top Tomadores
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Principais clientes por faturamento
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tomador</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CNPJ</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total Faturado</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Notas</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Ticket Médio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topTomadores.map((tomador, index) => (
                    <TableRow key={tomador.id} hover>
                      <TableCell>
                        <Chip 
                          label={index + 1} 
                          size="small" 
                          color={index < 3 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{tomador.nome}</TableCell>
                      <TableCell>{tomador.cnpj}</TableCell>
                      <TableCell align="right">{formatCurrency(tomador.total)}</TableCell>
                      <TableCell align="right">{tomador.notas}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(tomador.total / tomador.notas)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Gráfico de Barras Horizontal */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Faturamento por Tomador
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topTomadores}
                    layout="vertical"
                    margin={{ left: 150 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      type="number" 
                      stroke={theme.palette.text.secondary}
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="nome" 
                      stroke={theme.palette.text.secondary}
                      width={140}
                      tick={{ fontSize: 12 }}
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Bar 
                      dataKey="total" 
                      name="Faturamento"
                      fill={theme.palette.primary.main} 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Dialog de Drill-Down */}
      <Dialog 
        open={drillDownOpen} 
        onClose={() => setDrillDownOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ZoomIn color="primary" />
            {drillDownData?.titulo || 'Detalhamento'}
          </Box>
          <IconButton onClick={() => setDrillDownOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {drillDownData && (
            <>
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="overline" color="text.secondary">
                      Total de Notas
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {drillDownData.dados.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="overline" color="text.secondary">
                      Valor Total
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {formatCurrency(drillDownData.dados.reduce((acc, n) => acc + n.valor, 0))}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="overline" color="text.secondary">
                      Período
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {drillDownData.mes}/2025
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {drillDownData.dados.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Número</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tomador</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Valor</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Data</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {drillDownData.dados.map((nota) => (
                        <TableRow key={nota.numero} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              #{nota.numero}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Business fontSize="small" color="action" />
                              {nota.tomador}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(nota.valor)}
                            </Typography>
                          </TableCell>
                          <TableCell>{nota.data}</TableCell>
                          <TableCell>
                            <Chip 
                              label={nota.status} 
                              size="small"
                              color={nota.status === 'emitida' ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ReceiptLong sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    Nenhuma nota encontrada para este período
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDrillDownOpen(false)}>Fechar</Button>
          <Button variant="contained" startIcon={<TableChart />}>
            Exportar Detalhes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RelatoriosPage;
