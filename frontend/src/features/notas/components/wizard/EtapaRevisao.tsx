import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Business,
  Person,
  Receipt,
  LocationOn,
  AttachMoney,
  Warning,
} from '@mui/icons-material';
import type { Tomador } from '../../../../types';
import type { DadosServico } from '../EmitirNotaWizard';

interface TributosCalculados {
  valorISS: number;
  valorIR: number;
  valorPIS: number;
  valorCOFINS: number;
  valorCSLL: number;
  valorINSS: number;
  totalRetencoes: number;
  valorLiquido: number;
}

interface EtapaRevisaoProps {
  tomador: Tomador | null;
  servico: DadosServico;
  tributos: TributosCalculados;
  modoSimulacao?: boolean;
}

const formatDocument = (doc: string, tipo: 'pj' | 'pf'): string => {
  if (tipo === 'pj') {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const EtapaRevisao: React.FC<EtapaRevisaoProps> = ({
  tomador,
  servico,
  tributos,
  modoSimulacao = false,
}) => {
  const theme = useTheme();

  if (!tomador) {
    return (
      <Alert severity="error">
        Nenhum tomador selecionado. Volte para a primeira etapa.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Revisão da Nota Fiscal
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Confira todos os dados antes de {modoSimulacao ? 'gerar a simulação' : 'emitir a nota fiscal'}
      </Typography>

      {modoSimulacao && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Atenção:</strong> Esta é apenas uma simulação. A nota não será transmitida para a prefeitura
            e não terá validade fiscal.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Card do Tomador */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: tomador.tipo === 'pj' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32,
                  }}
                >
                  {tomador.tipo === 'pj' ? <Business fontSize="small" /> : <Person fontSize="small" />}
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600}>
                  Tomador do Serviço
                </Typography>
              </Box>

              <Box sx={{ pl: 5 }}>
                <Typography variant="body1" fontWeight={500}>
                  {tomador.razaoSocial || tomador.nome}
                </Typography>
                {tomador.nomeFantasia && (
                  <Typography variant="body2" color="text.secondary">
                    {tomador.nomeFantasia}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}: {formatDocument(tomador.documento, tomador.tipo)}
                </Typography>
                {tomador.inscricaoMunicipal && (
                  <Typography variant="body2" color="text.secondary">
                    Inscrição Municipal: {tomador.inscricaoMunicipal}
                  </Typography>
                )}
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" sx={{ mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2">
                      {tomador.endereco.logradouro}, {tomador.endereco.numero}
                      {tomador.endereco.complemento && ` - ${tomador.endereco.complemento}`}
                    </Typography>
                    <Typography variant="body2">
                      {tomador.endereco.bairro} - {tomador.endereco.cidade}/{tomador.endereco.uf}
                    </Typography>
                    <Typography variant="body2">CEP: {tomador.endereco.cep}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card do Serviço */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                  <Receipt fontSize="small" />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600}>
                  Dados do Serviço
                </Typography>
              </Box>

              <Box sx={{ pl: 5 }}>
                <Typography variant="body2" color="text.secondary">
                  Descrição:
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {servico.descricao || 'Não informado'}
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      CNAE:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {servico.cnae || 'Não informado'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Cód. Tributação:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {servico.codigoTributacao || 'Não informado'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" sx={{ mt: 0.3 }} />
                  <Typography variant="body2">
                    Local de Prestação: {servico.municipioPrestacao} - {servico.ufPrestacao}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Valores */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                  <AttachMoney fontSize="small" />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600}>
                  Valores e Tributos
                </Typography>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {/* Valor do Serviço */}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Valor do Serviço</TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600}>
                          {formatCurrency(servico.valorServico)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* ISS */}
                    <TableRow>
                      <TableCell>
                        ISS ({servico.aliquotaISS}%)
                        {servico.retencaoISS && (
                          <Chip label="Retido" size="small" color="warning" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={servico.retencaoISS ? 'error' : 'text.primary'}>
                          {servico.retencaoISS ? '-' : ''}{formatCurrency(tributos.valorISS)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2} sx={{ bgcolor: 'grey.50', py: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          Retenções Federais
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* IR */}
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>
                        IR (1,5%)
                        {servico.retencaoIR && (
                          <Chip label="Retido" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={servico.retencaoIR ? 'error' : 'text.secondary'}>
                          {servico.retencaoIR ? '-' : ''}{formatCurrency(tributos.valorIR)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* PIS */}
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>
                        PIS (0,65%)
                        {servico.retencaoPIS && (
                          <Chip label="Retido" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={servico.retencaoPIS ? 'error' : 'text.secondary'}>
                          {servico.retencaoPIS ? '-' : ''}{formatCurrency(tributos.valorPIS)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* COFINS */}
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>
                        COFINS (3%)
                        {servico.retencaoCOFINS && (
                          <Chip label="Retido" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={servico.retencaoCOFINS ? 'error' : 'text.secondary'}>
                          {servico.retencaoCOFINS ? '-' : ''}{formatCurrency(tributos.valorCOFINS)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* CSLL */}
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>
                        CSLL (1%)
                        {servico.retencaoCSLL && (
                          <Chip label="Retido" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={servico.retencaoCSLL ? 'error' : 'text.secondary'}>
                          {servico.retencaoCSLL ? '-' : ''}{formatCurrency(tributos.valorCSLL)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* INSS */}
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>
                        INSS (11%)
                        {servico.retencaoINSS && (
                          <Chip label="Retido" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={servico.retencaoINSS ? 'error' : 'text.secondary'}>
                          {servico.retencaoINSS ? '-' : ''}{formatCurrency(tributos.valorINSS)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Total Retenções */}
                    <TableRow sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Total de Retenções</TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600} color="error">
                          -{formatCurrency(tributos.totalRetencoes + (servico.retencaoISS ? tributos.valorISS : 0))}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Valor Líquido */}
                    <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>
                        Valor Líquido a Receber
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h5" fontWeight={700} color="success.main">
                          {formatCurrency(tributos.valorLiquido)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações Adicionais */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              Após a emissão, a nota fiscal será enviada automaticamente para o email do tomador ({tomador.email}).
              Você também poderá baixar o XML e PDF na listagem de notas.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EtapaRevisao;
