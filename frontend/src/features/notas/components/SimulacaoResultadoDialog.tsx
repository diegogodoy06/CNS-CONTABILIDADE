import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Close,
  PictureAsPdf,
  Send,
  Edit,
  CheckCircle,
  Warning,
  Print,
  Share,
  Description,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DadosNota } from './EmitirNotaWizard';

interface SimulacaoResultadoDialogProps {
  open: boolean;
  onClose: () => void;
  dadosNota: DadosNota | null;
  onConverterEmissao?: () => void;
  onEditarSimulacao?: () => void;
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

const SimulacaoResultadoDialog: React.FC<SimulacaoResultadoDialogProps> = ({
  open,
  onClose,
  dadosNota,
  onConverterEmissao,
  onEditarSimulacao,
}) => {
  const theme = useTheme();
  const [gerando, setGerando] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!dadosNota || !dadosNota.tomador) {
    return null;
  }

  const { tomador, servico } = dadosNota;
  const dataSimulacao = new Date();
  const numeroSimulacao = `SIM-${format(dataSimulacao, 'yyyyMMdd')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handleGerarPDF = async () => {
    setGerando(true);
    // Simula geração do PDF
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGerando(false);
    // Em produção, aqui seria feito o download do PDF
    alert('PDF de simulação gerado com sucesso! O download iniciará em breve.');
  };

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(`https://app.cnscontabilidade.com.br/simulacao/${numeroSimulacao}`);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Description sx={{ fontSize: 28, color: 'secondary.main' }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Simulação de NF-e
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Código: {numeroSimulacao}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Alerta de Simulação */}
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ 
            mb: 3,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                DOCUMENTO NÃO FISCAL
              </Typography>
              <Typography variant="body2">
                Esta é apenas uma simulação e não possui validade fiscal. Para emitir a nota oficial, clique em "Converter em Emissão".
              </Typography>
            </Box>
            <Chip 
              label="SIMULAÇÃO" 
              color="warning" 
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Alert>

        {/* Preview da Nota */}
        <Paper 
          ref={previewRef}
          variant="outlined" 
          sx={{ 
            p: 3, 
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '"SIMULAÇÃO"',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: '80px',
              fontWeight: 700,
              color: alpha(theme.palette.warning.main, 0.08),
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Cabeçalho */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              mb: 3,
              pb: 2,
              borderBottom: '2px solid',
              borderColor: 'divider',
            }}>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  Empresa Demo Ltda
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CNPJ: 12.345.678/0001-99
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rua das Flores, 123 - Centro
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  São Paulo - SP | CEP: 01234-567
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Chip 
                  label="SIMULAÇÃO" 
                  color="warning"
                  sx={{ mb: 1, fontWeight: 600 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Data: {format(dataSimulacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Competência: {format(dataSimulacao, 'MM/yyyy')}
                </Typography>
              </Box>
            </Box>

            {/* Dados do Tomador */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                TOMADOR DO SERVIÇO
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      {tomador.tipo === 'pj' ? 'Razão Social' : 'Nome'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {tomador.razaoSocial || tomador.nome}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      {tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {tomador.tipo === 'pj' 
                        ? formatCNPJ(tomador.documento)
                        : formatCPF(tomador.documento)
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Endereço
                    </Typography>
                    <Typography variant="body1">
                      {tomador.endereco.logradouro}, {tomador.endereco.numero}
                      {tomador.endereco.complemento && ` - ${tomador.endereco.complemento}`}
                      {' - '}{tomador.endereco.bairro}
                      {' - '}{tomador.endereco.cidade}/{tomador.endereco.uf}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Descrição do Serviço */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                DISCRIMINAÇÃO DO SERVIÇO
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {servico.descricao || 'Serviços de consultoria em tecnologia da informação'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">CNAE</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {servico.cnae || '6201-5/01'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Código Tributação</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {servico.codigoTributacao || '1.01'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Município</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {servico.municipioPrestacao}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Alíquota ISS</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {servico.aliquotaISS}%
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Valores */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  TRIBUTOS E RETENÇÕES
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">ISS ({servico.aliquotaISS}%)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" textAlign="right">
                        {formatCurrency(servico.valorISS)}
                        {servico.retencaoISS && (
                          <Chip label="Retido" size="small" sx={{ ml: 1, height: 18 }} />
                        )}
                      </Typography>
                    </Grid>
                    
                    {servico.retencaoIR && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2">IR (1,5%)</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" textAlign="right" color="error.main">
                            - {formatCurrency(servico.valorIR)}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    
                    {servico.retencaoPIS && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2">PIS (0,65%)</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" textAlign="right" color="error.main">
                            - {formatCurrency(servico.valorPIS)}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    
                    {servico.retencaoCOFINS && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2">COFINS (3%)</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" textAlign="right" color="error.main">
                            - {formatCurrency(servico.valorCOFINS)}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    
                    {servico.retencaoCSLL && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2">CSLL (1%)</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" textAlign="right" color="error.main">
                            - {formatCurrency(servico.valorCSLL)}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    
                    {servico.retencaoINSS && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2">INSS (11%)</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" textAlign="right" color="error.main">
                            - {formatCurrency(servico.valorINSS)}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  RESUMO DE VALORES
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    borderColor: 'success.main'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Valor do Serviço</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(servico.valorServico)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Total Retenções</Typography>
                    <Typography variant="body2" color="error.main">
                      - {formatCurrency(
                        (servico.retencaoIR ? servico.valorIR : 0) +
                        (servico.retencaoPIS ? servico.valorPIS : 0) +
                        (servico.retencaoCOFINS ? servico.valorCOFINS : 0) +
                        (servico.retencaoCSLL ? servico.valorCSLL : 0) +
                        (servico.retencaoINSS ? servico.valorINSS : 0) +
                        (servico.retencaoISS ? servico.valorISS : 0)
                      )}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Valor Líquido
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="success.main">
                      {formatCurrency(servico.valorLiquido)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Ações Rápidas */}
        <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Tooltip title="Baixar PDF da simulação">
            <Button
              variant="outlined"
              size="small"
              startIcon={gerando ? <CircularProgress size={16} /> : <PictureAsPdf />}
              onClick={handleGerarPDF}
              disabled={gerando}
            >
              {gerando ? 'Gerando...' : 'Baixar PDF'}
            </Button>
          </Tooltip>
          
          <Tooltip title="Imprimir simulação">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Print />}
              onClick={handleImprimir}
            >
              Imprimir
            </Button>
          </Tooltip>
          
          <Tooltip title={linkCopiado ? 'Link copiado!' : 'Copiar link para compartilhar'}>
            <Button
              variant="outlined"
              size="small"
              startIcon={linkCopiado ? <CheckCircle color="success" /> : <Share />}
              onClick={handleCopiarLink}
              color={linkCopiado ? 'success' : 'primary'}
            >
              {linkCopiado ? 'Copiado!' : 'Compartilhar'}
            </Button>
          </Tooltip>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={onEditarSimulacao}
        >
          Editar Dados
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<Send />}
          onClick={onConverterEmissao}
        >
          Converter em Emissão
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimulacaoResultadoDialog;
