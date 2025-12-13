import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  FormControlLabel,
  Switch,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Autocomplete,
} from '@mui/material';
import {
  Search,
  Add,
  Send,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Campaign,
  Schedule,
  CheckCircle,
  People,
  Warning,
  Info,
  Business,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock de comunicados
const mockComunicados = [
  {
    id: '1',
    titulo: 'Alteração no prazo de entrega da DCTF',
    mensagem: 'Informamos que houve alteração no prazo de entrega da DCTF referente ao mês de dezembro/2025. O novo prazo é dia 20/01/2026.',
    tipo: 'urgente' as const,
    destinatarios: 'todos' as const,
    dataEnvio: '2025-12-10T14:00:00',
    status: 'enviado' as const,
    leituras: 38,
    totalDestinatarios: 47,
  },
  {
    id: '2',
    titulo: 'Lembrete: Fechamento do mês',
    mensagem: 'Lembramos que o prazo para envio de documentos referentes a dezembro/2025 é até dia 05/01/2026. Documentos enviados após esta data poderão impactar obrigações.',
    tipo: 'aviso' as const,
    destinatarios: 'ativos' as const,
    dataEnvio: '2025-12-12T10:00:00',
    status: 'enviado' as const,
    leituras: 42,
    totalDestinatarios: 47,
  },
  {
    id: '3',
    titulo: 'Regularização de pendências',
    mensagem: 'Verificamos pendências em sua conta. Solicitamos que entre em contato conosco para regularização.',
    tipo: 'urgente' as const,
    destinatarios: 'inadimplentes' as const,
    dataEnvio: '2025-12-11T09:00:00',
    status: 'enviado' as const,
    leituras: 2,
    totalDestinatarios: 3,
  },
  {
    id: '4',
    titulo: 'Recesso de fim de ano',
    mensagem: 'Informamos que nosso escritório estará em recesso entre os dias 23/12 a 02/01. Para urgências, utilize o canal de plantão.',
    tipo: 'informativo' as const,
    destinatarios: 'todos' as const,
    dataEnvio: '2025-12-15T08:00:00',
    status: 'agendado' as const,
    leituras: 0,
    totalDestinatarios: 52,
  },
  {
    id: '5',
    titulo: 'Novo portal do cliente',
    mensagem: 'Estamos felizes em anunciar nosso novo portal do cliente! Acesse suas notas, guias e documentos de forma mais fácil.',
    tipo: 'informativo' as const,
    destinatarios: 'todos' as const,
    dataEnvio: '',
    status: 'rascunho' as const,
    leituras: 0,
    totalDestinatarios: 52,
  },
];

const mockClientes = [
  { id: '1', nome: 'Tech Solutions LTDA' },
  { id: '2', nome: 'Comércio ABC ME' },
  { id: '3', nome: 'Serviços XYZ LTDA' },
  { id: '4', nome: 'Indústria 123 LTDA' },
  { id: '5', nome: 'Consultoria DEF' },
];

const ComunicadosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComunicado, setSelectedComunicado] = useState<typeof mockComunicados[0] | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'informativo' as 'informativo' | 'urgente' | 'aviso',
    destinatarios: 'todos' as 'todos' | 'ativos' | 'inadimplentes' | 'especificos',
    clientesSelecionados: [] as string[],
    agendarEnvio: false,
    dataAgendamento: '',
  });

  const tabs = [
    { label: 'Todos', count: mockComunicados.length },
    { label: 'Enviados', count: mockComunicados.filter(c => c.status === 'enviado').length },
    { label: 'Agendados', count: mockComunicados.filter(c => c.status === 'agendado').length },
    { label: 'Rascunhos', count: mockComunicados.filter(c => c.status === 'rascunho').length },
  ];

  const steps = ['Conteúdo', 'Destinatários', 'Revisão'];

  const filteredComunicados = mockComunicados.filter(comunicado => {
    const matchesSearch =
      comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comunicado.mensagem.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 1) matchesTab = comunicado.status === 'enviado';
    if (activeTab === 2) matchesTab = comunicado.status === 'agendado';
    if (activeTab === 3) matchesTab = comunicado.status === 'rascunho';
    
    return matchesSearch && matchesTab;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, comunicado: typeof mockComunicados[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedComunicado(comunicado);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setFormData({
      titulo: '',
      mensagem: '',
      tipo: 'informativo',
      destinatarios: 'todos',
      clientesSelecionados: [],
      agendarEnvio: false,
      dataAgendamento: '',
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const getTipoConfig = (tipo: string) => {
    switch (tipo) {
      case 'urgente':
        return { color: 'error', icon: <Warning />, label: 'Urgente' };
      case 'aviso':
        return { color: 'warning', icon: <Info />, label: 'Aviso' };
      default:
        return { color: 'info', icon: <Campaign />, label: 'Informativo' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'enviado':
        return { color: 'success', label: 'Enviado' };
      case 'agendado':
        return { color: 'info', label: 'Agendado' };
      default:
        return { color: 'default', label: 'Rascunho' };
    }
  };

  const getDestinatariosLabel = (destinatarios: string) => {
    switch (destinatarios) {
      case 'todos': return 'Todos os clientes';
      case 'ativos': return 'Clientes ativos';
      case 'inadimplentes': return 'Clientes inadimplentes';
      default: return 'Clientes específicos';
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Título do Comunicado"
              fullWidth
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Alteração no prazo de entrega"
            />
            <TextField
              label="Mensagem"
              fullWidth
              multiline
              rows={6}
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              placeholder="Digite a mensagem do comunicado..."
            />
            <FormControl fullWidth>
              <InputLabel>Tipo de Comunicado</InputLabel>
              <Select
                value={formData.tipo}
                label="Tipo de Comunicado"
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'informativo' | 'urgente' | 'aviso' })}
              >
                <MenuItem value="informativo">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info color="info" fontSize="small" />
                    Informativo
                  </Box>
                </MenuItem>
                <MenuItem value="aviso">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="warning" fontSize="small" />
                    Aviso
                  </Box>
                </MenuItem>
                <MenuItem value="urgente">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="error" fontSize="small" />
                    Urgente
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Destinatários</InputLabel>
              <Select
                value={formData.destinatarios}
                label="Destinatários"
                onChange={(e) => setFormData({ ...formData, destinatarios: e.target.value as 'todos' | 'ativos' | 'inadimplentes' | 'especificos' })}
              >
                <MenuItem value="todos">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People fontSize="small" />
                    Todos os clientes (52)
                  </Box>
                </MenuItem>
                <MenuItem value="ativos">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" fontSize="small" />
                    Apenas clientes ativos (47)
                  </Box>
                </MenuItem>
                <MenuItem value="inadimplentes">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="warning" fontSize="small" />
                    Clientes inadimplentes (3)
                  </Box>
                </MenuItem>
                <MenuItem value="especificos">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business fontSize="small" />
                    Selecionar clientes específicos
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {formData.destinatarios === 'especificos' && (
              <Autocomplete
                multiple
                options={mockClientes}
                getOptionLabel={(option) => option.nome}
                value={mockClientes.filter(c => formData.clientesSelecionados.includes(c.id))}
                onChange={(_, newValue) => setFormData({ ...formData, clientesSelecionados: newValue.map(c => c.id) })}
                renderInput={(params) => (
                  <TextField {...params} label="Selecionar Clientes" placeholder="Buscar cliente..." />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.nome}
                      size="small"
                    />
                  ))
                }
              />
            )}

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.agendarEnvio}
                  onChange={(e) => setFormData({ ...formData, agendarEnvio: e.target.checked })}
                />
              }
              label="Agendar envio"
            />

            {formData.agendarEnvio && (
              <TextField
                label="Data e Hora do Envio"
                type="datetime-local"
                fullWidth
                value={formData.dataAgendamento}
                onChange={(e) => setFormData({ ...formData, dataAgendamento: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </Box>
        );
      case 2:
        const tipoConfig = getTipoConfig(formData.tipo);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="info">
              Revise as informações abaixo antes de enviar o comunicado.
            </Alert>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={tipoConfig.label}
                  size="small"
                  color={tipoConfig.color as 'error' | 'warning' | 'info'}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                {formData.titulo || 'Sem título'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {formData.mensagem || 'Sem mensagem'}
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Destinatários:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {getDestinatariosLabel(formData.destinatarios)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Envio:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formData.agendarEnvio
                    ? `Agendado para ${formData.dataAgendamento ? format(new Date(formData.dataAgendamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'data não definida'}`
                    : 'Imediato'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Comunicados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Envie comunicados em massa para seus clientes
          </Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={handleOpenDialog}>
          Novo Comunicado
        </Button>
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                <Send />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {mockComunicados.filter(c => c.status === 'enviado').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enviados
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                <Schedule />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {mockComunicados.filter(c => c.status === 'agendado').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Agendados
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                <Edit />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {mockComunicados.filter(c => c.status === 'rascunho').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rascunhos
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                <Visibility />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {Math.round(mockComunicados.filter(c => c.status === 'enviado').reduce((acc, c) => acc + (c.leituras / c.totalDestinatarios), 0) / mockComunicados.filter(c => c.status === 'enviado').length * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Taxa de Leitura
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Card */}
      <Card>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    <Chip
                      label={tab.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: activeTab === index ? 'primary.main' : 'grey.200',
                        color: activeTab === index ? 'white' : 'text.secondary',
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          {/* Busca */}
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar comunicados..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>

          {/* Tabela */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Comunicado</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Destinatários</TableCell>
                  <TableCell>Data Envio</TableCell>
                  <TableCell align="center">Leituras</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComunicados.map((comunicado) => {
                  const tipoConfig = getTipoConfig(comunicado.tipo);
                  const statusConfig = getStatusConfig(comunicado.status);
                  const taxaLeitura = comunicado.totalDestinatarios > 0
                    ? Math.round((comunicado.leituras / comunicado.totalDestinatarios) * 100)
                    : 0;

                  return (
                    <TableRow key={comunicado.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {comunicado.titulo}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {comunicado.mensagem}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={tipoConfig.icon}
                          label={tipoConfig.label}
                          size="small"
                          color={tipoConfig.color as 'error' | 'warning' | 'info'}
                          variant="outlined"
                          sx={{ '& .MuiChip-icon': { fontSize: 16 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getDestinatariosLabel(comunicado.destinatarios)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comunicado.totalDestinatarios} clientes
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {comunicado.dataEnvio ? (
                          <Typography variant="body2">
                            {format(new Date(comunicado.dataEnvio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {comunicado.status === 'enviado' ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {comunicado.leituras}/{comunicado.totalDestinatarios}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {taxaLeitura}%
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusConfig.label}
                          size="small"
                          color={statusConfig.color as 'success' | 'info' | 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalhes">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, comunicado)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Menu de Contexto */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Ver Detalhes
        </MenuItem>
        {selectedComunicado?.status !== 'enviado' && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
            Editar
          </MenuItem>
        )}
        {selectedComunicado?.status === 'rascunho' && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><Send fontSize="small" /></ListItemIcon>
            Enviar Agora
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Excluir
        </MenuItem>
      </Menu>

      {/* Dialog de Novo Comunicado */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Novo Comunicado</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          {activeStep > 0 && (
            <Button startIcon={<ArrowBack />} onClick={() => setActiveStep(prev => prev - 1)}>
              Voltar
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => setActiveStep(prev => prev + 1)}
              disabled={activeStep === 0 && (!formData.titulo || !formData.mensagem)}
            >
              Próximo
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={formData.agendarEnvio ? <Schedule /> : <Send />}
              onClick={() => setDialogOpen(false)}
            >
              {formData.agendarEnvio ? 'Agendar Envio' : 'Enviar Agora'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComunicadosPage;
