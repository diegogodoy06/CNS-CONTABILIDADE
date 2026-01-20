import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  alpha,
  useTheme,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Receipt,
  TrendingUp,
  TrendingDown,
  Download,
  Visibility,
  Business,
  Person,
  Email,
  Phone,
  LocationOn,
  AttachMoney,
  Assessment,
} from '@mui/icons-material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Tomador, NotaFiscal } from '../../../types';
import notasService from '../../../services/notasService';

interface HistoricoTomadorDialogProps {
  open: boolean;
  onClose: () => void;
  tomador: Tomador | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatCNPJ = (cnpj: string) => {
  const numeros = cnpj.replace(/\D/g, '');
  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

const formatCPF = (cpf: string) => {
  const numeros = cpf.replace(/\D/g, '');
  return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
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

interface DadoGrafico {
  mes: string;
  valor: number;
  notas: number;
}

const HistoricoTomadorDialog: React.FC<HistoricoTomadorDialogProps> = ({
  open,
  onClose,
  tomador,
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<DadoGrafico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do tomador
  const fetchDados = useCallback(async () => {
    if (!tomador || !open) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await notasService.findAll({
        tomadorId: tomador.id,
        limit: 50,
      });
      
      const notasData = response.items || [];
      setNotas(notasData);
      
      // Calcular dados do gráfico (últimos 6 meses)
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const agora = new Date();
      const grafico: DadoGrafico[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        const mesIndex = data.getMonth();
        const ano = data.getFullYear();
        
        const notasDoMes = notasData.filter((n: NotaFiscal) => {
          const dataNota = parseISO(n.dataEmissao);
          return dataNota.getMonth() === mesIndex && dataNota.getFullYear() === ano;
        });
        
        grafico.push({
          mes: meses[mesIndex],
          valor: notasDoMes.reduce((sum: number, n: NotaFiscal) => sum + (n.valores?.valorServico || 0), 0),
          notas: notasDoMes.length,
        });
      }
      
      setDadosGrafico(grafico);
    } catch (err: any) {
      console.error('Erro ao carregar histórico:', err);
      setError(err.response?.data?.message || 'Erro ao carregar histórico');
    } finally {
      setIsLoading(false);
    }
  }, [tomador, open]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  if (!tomador) {
    return null;
  }

  // Calcular estatísticas
  const totalNotas = notas.length;
  const faturamentoTotal = notas.reduce((sum, n) => sum + (n.valores?.valorServico || 0), 0);
  const ticketMedio = totalNotas > 0 ? faturamentoTotal / totalNotas : 0;
  const ultimaNota = notas[0];
  
  // Calcular variação
  const faturamentoMesAtual = dadosGrafico.length > 0 ? dadosGrafico[dadosGrafico.length - 1].valor : 0;
  const faturamentoMesAnterior = dadosGrafico.length > 1 ? dadosGrafico[dadosGrafico.length - 2].valor : 0;
  const variacao = faturamentoMesAnterior > 0 
    ? ((faturamentoMesAtual - faturamentoMesAnterior) / faturamentoMesAnterior) * 100 
    : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main'
              }}
            >
              {tomador.tipo === 'pj' ? <Business /> : <Person />}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {tomador.razaoSocial || tomador.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}: {' '}
                {tomador.tipo === 'pj' 
                  ? formatCNPJ(tomador.documento)
                  : formatCPF(tomador.documento)
                }
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Cards de Estatísticas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
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
                    Total de Notas
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {totalNotas}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
                    Faturamento Total
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {formatCurrency(faturamentoTotal)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              variant="outlined"
              sx={{ 
                bgcolor: alpha(theme.palette.info.main, 0.04),
                borderColor: alpha(theme.palette.info.main, 0.2)
              }}
            >
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Assessment sx={{ fontSize: 20, color: 'info.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Ticket Médio
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="info.main">
                  {formatCurrency(ticketMedio)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              variant="outlined"
              sx={{ 
                bgcolor: alpha(variacao >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.04),
                borderColor: alpha(variacao >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.2)
              }}
            >
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {variacao >= 0 ? (
                    <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 20, color: 'error.main' }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Variação Mensal
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  fontWeight={700} 
                  color={variacao >= 0 ? 'success.main' : 'error.main'}
                >
                  {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
          >
            <Tab label="Visão Geral" />
            <Tab label="Histórico de Notas" />
            <Tab label="Dados Cadastrais" />
          </Tabs>
        </Box>

        {/* Tab: Visão Geral */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Gráfico de Faturamento */}
            <Grid item xs={12} md={8}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Faturamento nos últimos 6 meses
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dadosGrafico}>
                      <defs>
                        <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis 
                        dataKey="mes" 
                        tick={{ fontSize: 12 }}
                        stroke={theme.palette.text.secondary}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke={theme.palette.text.secondary}
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
                      <Area 
                        type="monotone" 
                        dataKey="valor" 
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        fill="url(#colorValor)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Resumo */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Resumo do Relacionamento
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cliente desde
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {format(parseISO(tomador.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Última nota emitida
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {ultimaNota ? format(parseISO(ultimaNota.dataEmissao!), "dd/MM/yyyy") : '-'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Frequência média
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      ~1 nota por mês
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip 
                      label={tomador.ativo ? 'Ativo' : 'Inativo'}
                      color={tomador.ativo ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Últimas Notas */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Últimas Notas Emitidas
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => setTabValue(1)}
                  >
                    Ver todas
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nº</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notas.slice(0, 3).map((nota) => (
                        <TableRow key={nota.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {nota.numero}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {nota.dataEmissao && format(parseISO(nota.dataEmissao), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                              {nota.servico.descricao}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={500}>
                              {formatCurrency(nota.valores.valorServico)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label="Emitida" 
                              color="success" 
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab: Histórico de Notas */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nº Nota</TableCell>
                  <TableCell>Data Emissão</TableCell>
                  <TableCell>Competência</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Valor Serviço</TableCell>
                  <TableCell align="right">ISS</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notas.map((nota) => (
                  <TableRow key={nota.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {nota.numero}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {nota.dataEmissao && format(parseISO(nota.dataEmissao), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{nota.dataCompetencia}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                        {nota.servico.descricao}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(nota.valores.valorServico)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(nota.tributos.iss.valor)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label="Emitida" 
                        color="success" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Visualizar">
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

        {/* Tab: Dados Cadastrais */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Informações Básicas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {tomador.tipo === 'pj' ? <Business fontSize="small" color="action" /> : <Person fontSize="small" color="action" />}
                      <Typography variant="body2" color="text.secondary">
                        {tomador.tipo === 'pj' ? 'Razão Social' : 'Nome'}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={500} sx={{ ml: 3 }}>
                      {tomador.razaoSocial || tomador.nome}
                    </Typography>
                  </Grid>

                  {tomador.nomeFantasia && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Nome Fantasia
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 3 }}>
                        {tomador.nomeFantasia}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      {tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ ml: 3 }}>
                      {tomador.tipo === 'pj' 
                        ? formatCNPJ(tomador.documento)
                        : formatCPF(tomador.documento)
                      }
                    </Typography>
                  </Grid>

                  {tomador.inscricaoEstadual && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Inscrição Estadual
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 3 }}>
                        {tomador.inscricaoEstadual}
                      </Typography>
                    </Grid>
                  )}

                  {tomador.inscricaoMunicipal && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Inscrição Municipal
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 3 }}>
                        {tomador.inscricaoMunicipal}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Contato
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        E-mail
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 3 }}>
                      {tomador.email || '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Telefone
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 3 }}>
                      {tomador.telefone || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Endereço
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="body1">
                      {tomador.endereco.logradouro}, {tomador.endereco.numero}
                      {tomador.endereco.complemento && ` - ${tomador.endereco.complemento}`}
                    </Typography>
                    <Typography variant="body1">
                      {tomador.endereco.bairro}
                    </Typography>
                    <Typography variant="body1">
                      {tomador.endereco.cidade} - {tomador.endereco.uf}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CEP: {tomador.endereco.cep}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Fechar
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Receipt />}
        >
          Emitir Nova Nota
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoricoTomadorDialog;
