import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Divider,
  Chip,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Close,
  Search,
  Business,
  CheckCircle,
  Error as ErrorIcon,
  PersonAdd,
} from '@mui/icons-material';
import type { Tomador } from '../../../types';

interface ConsultaCNPJDialogProps {
  open: boolean;
  onClose: () => void;
  onImportar: (dados: Partial<Tomador>) => void;
}

interface DadosCNPJ {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: 'ATIVA' | 'BAIXADA' | 'INAPTA' | 'SUSPENSA';
  dataAbertura: string;
  naturezaJuridica: string;
  cnaePrincipal: {
    codigo: string;
    descricao: string;
  };
  cnaesSecundarios: Array<{
    codigo: string;
    descricao: string;
  }>;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  telefone?: string;
  email?: string;
  capitalSocial?: number;
  porte?: string;
  optanteSimplesNacional?: boolean;
  optanteMei?: boolean;
}

// Mock de consulta CNPJ
const mockConsultaCNPJ = async (cnpj: string): Promise<DadosCNPJ | null> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Remove formatação
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  // Mock de dados para alguns CNPJs
  const mockData: Record<string, DadosCNPJ> = {
    '12345678000190': {
      cnpj: '12345678000190',
      razaoSocial: 'TECH SOLUTIONS LTDA',
      nomeFantasia: 'Tech Solutions',
      situacao: 'ATIVA',
      dataAbertura: '2018-03-15',
      naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
      cnaePrincipal: {
        codigo: '6201-5/01',
        descricao: 'Desenvolvimento de programas de computador sob encomenda',
      },
      cnaesSecundarios: [
        { codigo: '6202-3/00', descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis' },
        { codigo: '6204-0/00', descricao: 'Consultoria em tecnologia da informação' },
      ],
      endereco: {
        logradouro: 'Avenida Paulista',
        numero: '1000',
        complemento: 'Sala 501',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01310-100',
      },
      telefone: '(11) 3333-4444',
      email: 'contato@techsolutions.com.br',
      capitalSocial: 100000,
      porte: 'PEQUENO',
      optanteSimplesNacional: true,
      optanteMei: false,
    },
    '98765432000110': {
      cnpj: '98765432000110',
      razaoSocial: 'CONSULTORIA ALPHA S.A.',
      nomeFantasia: 'Alpha Consulting',
      situacao: 'ATIVA',
      dataAbertura: '2010-07-22',
      naturezaJuridica: '205-4 - Sociedade Anônima Fechada',
      cnaePrincipal: {
        codigo: '7020-4/00',
        descricao: 'Atividades de consultoria em gestão empresarial',
      },
      cnaesSecundarios: [
        { codigo: '7490-1/04', descricao: 'Atividades de intermediação e agenciamento de serviços' },
      ],
      endereco: {
        logradouro: 'Rua Augusta',
        numero: '500',
        bairro: 'Consolação',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01304-000',
      },
      telefone: '(11) 2222-3333',
      email: 'contato@alphaconsulting.com.br',
      capitalSocial: 500000,
      porte: 'MEDIO',
      optanteSimplesNacional: false,
      optanteMei: false,
    },
  };
  
  return mockData[cnpjLimpo] || null;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const ConsultaCNPJDialog: React.FC<ConsultaCNPJDialogProps> = ({
  open,
  onClose,
  onImportar,
}) => {
  const theme = useTheme();
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [dados, setDados] = useState<DadosCNPJ | null>(null);

  const handleConsultar = async () => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      setErro('CNPJ inválido. Informe os 14 dígitos.');
      return;
    }

    setLoading(true);
    setErro(null);
    setDados(null);

    try {
      const resultado = await mockConsultaCNPJ(cnpj);
      
      if (resultado) {
        setDados(resultado);
      } else {
        setErro('CNPJ não encontrado na base de dados da Receita Federal.');
      }
    } catch {
      setErro('Erro ao consultar CNPJ. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportar = () => {
    if (!dados) return;

    const tomador: Partial<Tomador> = {
      tipo: 'pj',
      documento: dados.cnpj,
      razaoSocial: dados.razaoSocial,
      nomeFantasia: dados.nomeFantasia,
      endereco: {
        cep: dados.endereco.cep.replace(/\D/g, ''),
        logradouro: dados.endereco.logradouro,
        numero: dados.endereco.numero,
        complemento: dados.endereco.complemento,
        bairro: dados.endereco.bairro,
        cidade: dados.endereco.cidade,
        uf: dados.endereco.uf,
        codigoMunicipio: '', // Seria preenchido com código IBGE
      },
      telefone: dados.telefone,
      email: dados.email,
    };

    onImportar(tomador);
    handleLimpar();
    onClose();
  };

  const handleLimpar = () => {
    setCnpj('');
    setDados(null);
    setErro(null);
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'ATIVA': return 'success';
      case 'BAIXADA': return 'error';
      case 'INAPTA': return 'error';
      case 'SUSPENSA': return 'warning';
      default: return 'default';
    }
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
            <Business sx={{ fontSize: 28, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Consultar CNPJ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Importar dados da Receita Federal
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Campo de busca */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                variant="outlined"
                value={cnpj}
                onChange={(e) => {
                  // Formata CNPJ automaticamente
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = value;
                  if (value.length > 2) formatted = value.slice(0, 2) + '.' + value.slice(2);
                  if (value.length > 5) formatted = formatted.slice(0, 6) + '.' + formatted.slice(6);
                  if (value.length > 8) formatted = formatted.slice(0, 10) + '/' + formatted.slice(10);
                  if (value.length > 12) formatted = formatted.slice(0, 15) + '-' + formatted.slice(15);
                  setCnpj(formatted.slice(0, 18));
                }}
                disabled={loading}
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                onClick={handleConsultar}
                disabled={loading || cnpj.replace(/\D/g, '').length !== 14}
                sx={{ height: 56 }}
              >
                {loading ? 'Consultando...' : 'Consultar'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Erro */}
        {erro && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErro(null)}>
            {erro}
          </Alert>
        )}

        {/* Resultado */}
        {dados && (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3,
              bgcolor: alpha(theme.palette.success.main, 0.02),
              borderColor: alpha(theme.palette.success.main, 0.3)
            }}
          >
            {/* Header do resultado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {dados.razaoSocial}
                </Typography>
                {dados.nomeFantasia && (
                  <Typography variant="body2" color="text.secondary">
                    {dados.nomeFantasia}
                  </Typography>
                )}
              </Box>
              <Chip 
                label={dados.situacao}
                color={getSituacaoColor(dados.situacao) as any}
                icon={dados.situacao === 'ATIVA' ? <CheckCircle /> : <ErrorIcon />}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Dados principais */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  CNPJ
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dados.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Data de Abertura
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {new Date(dados.dataAbertura).toLocaleDateString('pt-BR')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Porte
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dados.porte || '-'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Natureza Jurídica
                </Typography>
                <Typography variant="body1">
                  {dados.naturezaJuridica}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Capital Social
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dados.capitalSocial ? formatCurrency(dados.capitalSocial) : '-'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  CNAE Principal
                </Typography>
                <Typography variant="body1">
                  <strong>{dados.cnaePrincipal.codigo}</strong> - {dados.cnaePrincipal.descricao}
                </Typography>
              </Grid>

              {dados.cnaesSecundarios.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    CNAEs Secundários
                  </Typography>
                  {dados.cnaesSecundarios.map((cnae, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                      • <strong>{cnae.codigo}</strong> - {cnae.descricao}
                    </Typography>
                  ))}
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Endereço
                </Typography>
                <Typography variant="body1">
                  {dados.endereco.logradouro}, {dados.endereco.numero}
                  {dados.endereco.complemento && ` - ${dados.endereco.complemento}`}
                </Typography>
                <Typography variant="body1">
                  {dados.endereco.bairro} - {dados.endereco.cidade}/{dados.endereco.uf}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CEP: {dados.endereco.cep}
                </Typography>
              </Grid>

              {(dados.telefone || dados.email) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Telefone
                    </Typography>
                    <Typography variant="body1">
                      {dados.telefone || '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      E-mail
                    </Typography>
                    <Typography variant="body1">
                      {dados.email || '-'}
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {dados.optanteSimplesNacional && (
                    <Chip label="Optante Simples Nacional" size="small" color="info" />
                  )}
                  {dados.optanteMei && (
                    <Chip label="MEI" size="small" color="secondary" />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Instrução inicial */}
        {!dados && !erro && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Business sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Digite o CNPJ para consultar os dados na Receita Federal
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Os dados serão importados automaticamente para o cadastro do tomador
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleLimpar} disabled={loading}>
          Limpar
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleImportar}
          disabled={!dados || dados.situacao !== 'ATIVA'}
        >
          Importar Dados
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultaCNPJDialog;
