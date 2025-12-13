import React, { useState } from 'react';
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

// Mock de notas do tomador
const mockNotasTomador: NotaFiscal[] = [
  {
    id: '1',
    numero: 1023,
    serie: '1',
    tipo: 'nfse',
    status: 'emitida',
    tomador: {} as Tomador,
    servico: { descricao: 'Desenvolvimento de Software', cnae: '6201501', codigoTributacaoMunicipal: '1.01' },
    valores: { valorServico: 4500, baseCalculo: 4500, valorLiquido: 4275 },
    tributos: { iss: { aliquota: 5, valor: 225, retido: false, exigibilidade: 'normal' } },
    dataEmissao: '2024-12-10',
    dataCompetencia: '12/2024',
    localPrestacao: { municipio: 'São Paulo', uf: 'SP', codigoMunicipio: '3550308' },
    protocoloPrefeitura: 'SP2024121000001',
    codigoVerificacao: 'ABC123',
    createdAt: '2024-12-10T10:30:00',
    updatedAt: '2024-12-10T10:30:00',
  },
  {
    id: '2',
    numero: 1018,
    serie: '1',
    tipo: 'nfse',
    status: 'emitida',
    tomador: {} as Tomador,
    servico: { descricao: 'Consultoria em TI', cnae: '6204000', codigoTributacaoMunicipal: '1.05' },
    valores: { valorServico: 3200, baseCalculo: 3200, valorLiquido: 3040 },
    tributos: { iss: { aliquota: 5, valor: 160, retido: false, exigibilidade: 'normal' } },
    dataEmissao: '2024-11-25',
    dataCompetencia: '11/2024',
    localPrestacao: { municipio: 'São Paulo', uf: 'SP', codigoMunicipio: '3550308' },
    protocoloPrefeitura: 'SP2024112500002',
    codigoVerificacao: 'DEF456',
    createdAt: '2024-11-25T14:20:00',
    updatedAt: '2024-11-25T14:20:00',
  },
  {
    id: '3',
    numero: 1010,
    serie: '1',
    tipo: 'nfse',
    status: 'emitida',
    tomador: {} as Tomador,
    servico: { descricao: 'Manutenção de Sistemas', cnae: '6201501', codigoTributacaoMunicipal: '1.01' },
    valores: { valorServico: 2800, baseCalculo: 2800, valorLiquido: 2660 },
    tributos: { iss: { aliquota: 5, valor: 140, retido: false, exigibilidade: 'normal' } },
    dataEmissao: '2024-10-15',
    dataCompetencia: '10/2024',
    localPrestacao: { municipio: 'São Paulo', uf: 'SP', codigoMunicipio: '3550308' },
    protocoloPrefeitura: 'SP2024101500003',
    codigoVerificacao: 'GHI789',
    createdAt: '2024-10-15T09:00:00',
    updatedAt: '2024-10-15T09:00:00',
  },
];

// Mock de dados para gráfico
const mockDadosGrafico = [
  { mes: 'Jul', valor: 0, notas: 0 },
  { mes: 'Ago', valor: 1500, notas: 1 },
  { mes: 'Set', valor: 0, notas: 0 },
  { mes: 'Out', valor: 2800, notas: 1 },
  { mes: 'Nov', valor: 3200, notas: 1 },
  { mes: 'Dez', valor: 4500, notas: 1 },
];

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

const HistoricoTomadorDialog: React.FC<HistoricoTomadorDialogProps> = ({
  open,
  onClose,
  tomador,
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  if (!tomador) {
    return null;
  }

  // Calcular estatísticas
  const totalNotas = mockNotasTomador.length;
  const faturamentoTotal = mockNotasTomador.reduce((sum, n) => sum + n.valores.valorServico, 0);
  const ticketMedio = totalNotas > 0 ? faturamentoTotal / totalNotas : 0;
  const ultimaNota = mockNotasTomador[0];
  
  // Calcular variação
  const faturamentoMesAtual = mockDadosGrafico[mockDadosGrafico.length - 1].valor;
  const faturamentoMesAnterior = mockDadosGrafico[mockDadosGrafico.length - 2].valor;
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
                    <AreaChart data={mockDadosGrafico}>
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
                      {mockNotasTomador.slice(0, 3).map((nota) => (
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
                {mockNotasTomador.map((nota) => (
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
