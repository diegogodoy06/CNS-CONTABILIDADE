import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  Alert,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import {
  Business,
  Person,
  Notifications,
  Security,
  Palette,
  CloudUpload,
  Save,
  Edit,
  PhotoCamera,
  AccountBalance,
  Description,
  CalendarMonth,
  LightMode,
  DarkMode,
  Language,
  LocationOn,
  Phone,
  Email,
  Badge,
  ReceiptLong,
  Percent,
  Key,
  Verified,
  Warning,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { toggleDarkMode } from '../../../store/slices/uiSlice';

// Tipos
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel Component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

// Mock data da empresa
const mockEmpresa = {
  razaoSocial: 'Tech Solutions Ltda',
  nomeFantasia: 'Tech Solutions',
  cnpj: '12.345.678/0001-90',
  inscricaoEstadual: '123.456.789.012',
  inscricaoMunicipal: '12345678',
  cnae: '6201-5/01 - Desenvolvimento de programas de computador sob encomenda',
  regimeTributario: 'Simples Nacional',
  endereco: {
    cep: '01310-100',
    logradouro: 'Av. Paulista',
    numero: '1000',
    complemento: 'Sala 1001',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  contato: {
    telefone: '(11) 3000-0000',
    celular: '(11) 99000-0000',
    email: 'contato@techsolutions.com.br',
    site: 'www.techsolutions.com.br',
  },
  responsavel: {
    nome: 'João da Silva',
    cpf: '123.456.789-00',
    cargo: 'Diretor',
    email: 'joao@techsolutions.com.br',
    telefone: '(11) 99000-0001',
  },
};

const mockConfiguracoesFiscais = {
  aliquotaISS: 5.0,
  municipioPrestacao: 'São Paulo - SP',
  serieNFe: '1',
  ultimoNumeroNFe: 1234,
  ambienteEmissao: 'producao',
  retencaoIR: true,
  retencaoPIS: true,
  retencaoCOFINS: true,
  retencaoCSLL: true,
  retencaoINSS: false,
};

const mockCertificado = {
  tipo: 'A1',
  razaoSocial: 'Tech Solutions Ltda',
  cnpj: '12.345.678/0001-90',
  validoAte: '2025-06-15',
  emitidoPor: 'AC SERASA RFB v5',
  status: 'valido',
};

const ConfiguracoesPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Estados dos formulários
  const [empresa, setEmpresa] = useState(mockEmpresa);
  const [configFiscais, setConfigFiscais] = useState(mockConfiguracoesFiscais);
  const [preferencias, setPreferencias] = useState({
    idioma: 'pt-BR',
    formatoData: 'DD/MM/YYYY',
    formatoMoeda: 'BRL',
    notificacoesEmail: true,
    notificacoesPush: true,
    resumoDiario: false,
  });

  const handleSave = () => {
    setShowSaveSuccess(true);
    setEditMode(false);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const calcularDiasParaVencimento = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const diasParaVencimento = calcularDiasParaVencimento(mockCertificado.validoAte);
  const statusCertificado = diasParaVencimento <= 0 ? 'vencido' : diasParaVencimento <= 30 ? 'proximo_vencimento' : 'valido';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie os dados da empresa, configurações fiscais e preferências do sistema.
        </Typography>
      </Box>

      {showSaveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSaveSuccess(false)}>
          Configurações salvas com sucesso!
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
            },
          }}
        >
          <Tab icon={<Business />} label="Dados da Empresa" iconPosition="start" />
          <Tab icon={<AccountBalance />} label="Configurações Fiscais" iconPosition="start" />
          <Tab icon={<Key />} label="Certificado Digital" iconPosition="start" />
          <Tab icon={<Palette />} label="Preferências" iconPosition="start" />
        </Tabs>
      </Card>

      {/* Tab 0: Dados da Empresa */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Dados Cadastrais
                  </Typography>
                  <Button
                    variant={editMode ? 'contained' : 'outlined'}
                    startIcon={editMode ? <Save /> : <Edit />}
                    onClick={editMode ? handleSave : () => setEditMode(true)}
                  >
                    {editMode ? 'Salvar Alterações' : 'Editar'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Razão Social"
                      value={empresa.razaoSocial}
                      onChange={(e) => setEmpresa({ ...empresa, razaoSocial: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      value={empresa.nomeFantasia}
                      onChange={(e) => setEmpresa({ ...empresa, nomeFantasia: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="CNPJ"
                      value={empresa.cnpj}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Inscrição Estadual"
                      value={empresa.inscricaoEstadual}
                      onChange={(e) => setEmpresa({ ...empresa, inscricaoEstadual: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Inscrição Municipal"
                      value={empresa.inscricaoMunicipal}
                      onChange={(e) => setEmpresa({ ...empresa, inscricaoMunicipal: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="CNAE Principal"
                      value={empresa.cnae}
                      onChange={(e) => setEmpresa({ ...empresa, cnae: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled={!editMode}>
                      <InputLabel>Regime Tributário</InputLabel>
                      <Select
                        value={empresa.regimeTributario}
                        label="Regime Tributário"
                        onChange={(e) => setEmpresa({ ...empresa, regimeTributario: e.target.value })}
                      >
                        <MenuItem value="Simples Nacional">Simples Nacional</MenuItem>
                        <MenuItem value="Lucro Presumido">Lucro Presumido</MenuItem>
                        <MenuItem value="Lucro Real">Lucro Real</MenuItem>
                        <MenuItem value="MEI">MEI</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Endereço */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Endereço
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="CEP"
                      value={empresa.endereco.cep}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        endereco: { ...empresa.endereco, cep: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Logradouro"
                      value={empresa.endereco.logradouro}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        endereco: { ...empresa.endereco, logradouro: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Número"
                      value={empresa.endereco.numero}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        endereco: { ...empresa.endereco, numero: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Complemento"
                      value={empresa.endereco.complemento}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        endereco: { ...empresa.endereco, complemento: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Bairro"
                      value={empresa.endereco.bairro}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        endereco: { ...empresa.endereco, bairro: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      value={empresa.endereco.cidade}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        endereco: { ...empresa.endereco, cidade: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <TextField
                      fullWidth
                      label="UF"
                      value={empresa.endereco.uf}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        endereco: { ...empresa.endereco, uf: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Contato */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  <Phone sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Contato
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={empresa.contato.telefone}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        contato: { ...empresa.contato, telefone: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Celular"
                      value={empresa.contato.celular}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        contato: { ...empresa.contato, celular: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="E-mail"
                      type="email"
                      value={empresa.contato.email}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        contato: { ...empresa.contato, email: e.target.value } 
                      })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Site"
                      value={empresa.contato.site}
                      onChange={(e) => setEmpresa({ 
                        ...empresa, 
                        contato: { ...empresa.contato, site: e.target.value } 
                      })}
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Logo da Empresa */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Logo da Empresa
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      fontSize: 48,
                      fontWeight: 700,
                      color: 'primary.main',
                    }}
                  >
                    {empresa.nomeFantasia.charAt(0)}
                  </Avatar>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    size="small"
                  >
                    Alterar Logo
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Formatos: PNG, JPG. Tamanho máximo: 2MB
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Responsável Legal */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Responsável Legal
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Nome" secondary={empresa.responsavel.nome} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="CPF" secondary={empresa.responsavel.cpf} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Cargo" secondary={empresa.responsavel.cargo} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="E-mail" secondary={empresa.responsavel.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Telefone" secondary={empresa.responsavel.telefone} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 1: Configurações Fiscais */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Configurações de Emissão de NF-e
                  </Typography>
                  <Button variant="outlined" startIcon={<Save />} onClick={handleSave}>
                    Salvar
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Alíquota ISS Padrão (%)"
                      type="number"
                      value={configFiscais.aliquotaISS}
                      onChange={(e) => setConfigFiscais({ 
                        ...configFiscais, 
                        aliquotaISS: parseFloat(e.target.value) 
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Percent />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Município de Prestação"
                      value={configFiscais.municipioPrestacao}
                      onChange={(e) => setConfigFiscais({ 
                        ...configFiscais, 
                        municipioPrestacao: e.target.value 
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Ambiente de Emissão</InputLabel>
                      <Select
                        value={configFiscais.ambienteEmissao}
                        label="Ambiente de Emissão"
                        onChange={(e) => setConfigFiscais({ 
                          ...configFiscais, 
                          ambienteEmissao: e.target.value 
                        })}
                      >
                        <MenuItem value="producao">Produção</MenuItem>
                        <MenuItem value="homologacao">Homologação</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Série NF-e"
                      value={configFiscais.serieNFe}
                      onChange={(e) => setConfigFiscais({ 
                        ...configFiscais, 
                        serieNFe: e.target.value 
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptLong />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Último Número NF-e"
                      type="number"
                      value={configFiscais.ultimoNumeroNFe}
                      disabled
                      helperText="Atualizado automaticamente"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Retenções Padrão */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Retenções Padrão
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Defina quais retenções devem ser aplicadas por padrão ao emitir notas fiscais.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={configFiscais.retencaoIR}
                          onChange={(e) => setConfigFiscais({ 
                            ...configFiscais, 
                            retencaoIR: e.target.checked 
                          })}
                        />
                      }
                      label="Retenção IR (1,5%)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={configFiscais.retencaoPIS}
                          onChange={(e) => setConfigFiscais({ 
                            ...configFiscais, 
                            retencaoPIS: e.target.checked 
                          })}
                        />
                      }
                      label="Retenção PIS (0,65%)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={configFiscais.retencaoCOFINS}
                          onChange={(e) => setConfigFiscais({ 
                            ...configFiscais, 
                            retencaoCOFINS: e.target.checked 
                          })}
                        />
                      }
                      label="Retenção COFINS (3%)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={configFiscais.retencaoCSLL}
                          onChange={(e) => setConfigFiscais({ 
                            ...configFiscais, 
                            retencaoCSLL: e.target.checked 
                          })}
                        />
                      }
                      label="Retenção CSLL (1%)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={configFiscais.retencaoINSS}
                          onChange={(e) => setConfigFiscais({ 
                            ...configFiscais, 
                            retencaoINSS: e.target.checked 
                          })}
                        />
                      }
                      label="Retenção INSS (11%)"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Info Cards */}
          <Grid item xs={12} lg={4}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Importante
              </Typography>
              <Typography variant="body2">
                As configurações fiscais impactam diretamente a emissão de notas fiscais. 
                Certifique-se de que os valores estão corretos antes de salvar.
              </Typography>
            </Alert>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Resumo do Período
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Description color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Notas emitidas este mês" secondary="45 notas" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Faturamento" secondary="R$ 125.430,00" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarMonth color="warning" />
                    </ListItemIcon>
                    <ListItemText primary="Última emissão" secondary="10/01/2025" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 2: Certificado Digital */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Certificado Digital Atual
                </Typography>

                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(
                        statusCertificado === 'vencido' 
                          ? theme.palette.error.main 
                          : statusCertificado === 'proximo_vencimento'
                            ? theme.palette.warning.main
                            : theme.palette.success.main,
                        0.1
                      ),
                      mb: 3,
                    }}
                  >
                    {statusCertificado === 'valido' ? (
                      <Verified color="success" sx={{ fontSize: 40 }} />
                    ) : (
                      <Warning color={statusCertificado === 'vencido' ? 'error' : 'warning'} sx={{ fontSize: 40 }} />
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {statusCertificado === 'vencido' 
                          ? 'Certificado Vencido!' 
                          : statusCertificado === 'proximo_vencimento'
                            ? `Vence em ${diasParaVencimento} dias`
                            : 'Certificado Válido'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Válido até: {new Date(mockCertificado.validoAte).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                  </Box>

                  <List>
                    <ListItem>
                      <ListItemText primary="Tipo" secondary={mockCertificado.tipo} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Razão Social" secondary={mockCertificado.razaoSocial} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="CNPJ" secondary={mockCertificado.cnpj} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Emitido por" secondary={mockCertificado.emitidoPor} />
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Atualizar Certificado
                </Typography>

                <Paper
                  sx={{
                    p: 4,
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Arraste o arquivo do certificado aqui
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ou clique para selecionar
                  </Typography>
                  <Button variant="outlined" size="small">
                    Selecionar Arquivo
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
                    Formatos aceitos: .pfx, .p12 (Certificado A1)
                  </Typography>
                </Paper>

                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Senha do Certificado"
                    type="password"
                    placeholder="Digite a senha do certificado"
                    helperText="A senha será usada para validar o certificado"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Key />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Button variant="contained" fullWidth sx={{ mt: 3 }} disabled>
                  Validar e Salvar Certificado
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 3: Preferências */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Aparência
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      {darkMode ? <DarkMode /> : <LightMode />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Tema Escuro"
                      secondary="Ativar modo noturno para reduzir cansaço visual"
                    />
                    <ListItemSecondaryAction>
                      <Switch edge="end" checked={darkMode} onChange={handleToggleDarkMode} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText primary="Idioma" secondary="Idioma da interface" />
                    <ListItemSecondaryAction>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={preferencias.idioma}
                          onChange={(e) => setPreferencias({ ...preferencias, idioma: e.target.value })}
                        >
                          <MenuItem value="pt-BR">Português (BR)</MenuItem>
                          <MenuItem value="en-US">English (US)</MenuItem>
                          <MenuItem value="es">Español</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Formatos
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Formato de Data</InputLabel>
                      <Select
                        value={preferencias.formatoData}
                        label="Formato de Data"
                        onChange={(e) => setPreferencias({ ...preferencias, formatoData: e.target.value })}
                      >
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</MenuItem>
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Moeda</InputLabel>
                      <Select
                        value={preferencias.formatoMoeda}
                        label="Moeda"
                        onChange={(e) => setPreferencias({ ...preferencias, formatoMoeda: e.target.value })}
                      >
                        <MenuItem value="BRL">Real Brasileiro (R$)</MenuItem>
                        <MenuItem value="USD">Dólar Americano (US$)</MenuItem>
                        <MenuItem value="EUR">Euro (€)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Notificações
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificações por E-mail"
                      secondary="Receber alertas importantes por e-mail"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={preferencias.notificacoesEmail}
                        onChange={(e) => setPreferencias({ 
                          ...preferencias, 
                          notificacoesEmail: e.target.checked 
                        })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificações Push"
                      secondary="Receber notificações no navegador"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={preferencias.notificacoesPush}
                        onChange={(e) => setPreferencias({ 
                          ...preferencias, 
                          notificacoesPush: e.target.checked 
                        })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <CalendarMonth />
                    </ListItemIcon>
                    <ListItemText
                      primary="Resumo Diário"
                      secondary="Receber resumo das atividades diariamente"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={preferencias.resumoDiario}
                        onChange={(e) => setPreferencias({ 
                          ...preferencias, 
                          resumoDiario: e.target.checked 
                        })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Button variant="text" color="primary" sx={{ mt: 2 }}>
                  Configurações avançadas de notificações →
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Segurança
                </Typography>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Alterar Senha"
                      secondary="Última alteração: há 30 dias"
                    />
                    <ListItemSecondaryAction>
                      <Button variant="outlined" size="small">
                        Alterar
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Autenticação em 2 Fatores"
                      secondary="Adicione uma camada extra de segurança"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Desativado" size="small" color="default" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Dispositivos Conectados"
                      secondary="2 dispositivos ativos"
                    />
                    <ListItemSecondaryAction>
                      <Button variant="outlined" size="small">
                        Gerenciar
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
            Salvar Preferências
          </Button>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default ConfiguracoesPage;
