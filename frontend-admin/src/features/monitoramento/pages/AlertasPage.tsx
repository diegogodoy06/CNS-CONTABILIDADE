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
  Tooltip,
  Tabs,
  Tab,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Search,
  Warning,
  Error as ErrorIcon,
  Info,
  CheckCircle,
  Visibility,
  Delete,
  Refresh,
  NotificationsOff,
  Business,
  Receipt,
  Assignment,
  Gavel,
  Security,
  MarkEmailRead,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock de alertas
const mockAlertas = [
  {
    id: '1',
    tipo: 'critico' as const,
    categoria: 'guia',
    titulo: 'ISS vencendo HOJE',
    descricao: 'A guia de ISS competência 11/2025 vence hoje. Valor: R$ 1.250,00',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    dataHora: '2025-12-13T08:00:00',
    lido: false,
  },
  {
    id: '2',
    tipo: 'critico' as const,
    categoria: 'guia',
    titulo: '3 guias FGTS vencidas',
    descricao: 'Existem 3 guias de FGTS vencidas. Total: R$ 4.580,00',
    clienteId: '2',
    clienteNome: 'Comércio ABC ME',
    dataHora: '2025-12-13T07:30:00',
    lido: false,
  },
  {
    id: '3',
    tipo: 'critico' as const,
    categoria: 'sistema',
    titulo: 'Certificado digital expira em 3 dias',
    descricao: 'O certificado A1 expira em 16/12/2025. Solicite renovação ao cliente.',
    clienteId: '3',
    clienteNome: 'Serviços XYZ LTDA',
    dataHora: '2025-12-13T06:00:00',
    lido: false,
  },
  {
    id: '4',
    tipo: 'importante' as const,
    categoria: 'ticket',
    titulo: 'Ticket sem resposta há 24h',
    descricao: 'O ticket #89 sobre dúvida de IRPF está aguardando resposta há mais de 24 horas.',
    clienteId: '4',
    clienteNome: 'Indústria 123 LTDA',
    dataHora: '2025-12-12T14:00:00',
    lido: false,
  },
  {
    id: '5',
    tipo: 'importante' as const,
    categoria: 'guia',
    titulo: 'DAS vencendo em 5 dias',
    descricao: 'A guia DAS competência 11/2025 vence em 18/12/2025. Valor: R$ 892,45',
    clienteId: '5',
    clienteNome: 'Consultoria DEF',
    dataHora: '2025-12-12T10:00:00',
    lido: true,
  },
  {
    id: '6',
    tipo: 'importante' as const,
    categoria: 'financeiro',
    titulo: 'Cliente inadimplente há 30 dias',
    descricao: 'O cliente está com mensalidade em atraso há 30 dias. Considerar bloqueio.',
    clienteId: '2',
    clienteNome: 'Comércio ABC ME',
    dataHora: '2025-12-11T09:00:00',
    lido: true,
  },
  {
    id: '7',
    tipo: 'informativo' as const,
    categoria: 'nota',
    titulo: 'NFS-e emitida com sucesso',
    descricao: 'Nota #1234 emitida com sucesso. Valor: R$ 15.000,00',
    clienteId: '1',
    clienteNome: 'Tech Solutions LTDA',
    dataHora: '2025-12-13T10:30:00',
    lido: true,
  },
  {
    id: '8',
    tipo: 'informativo' as const,
    categoria: 'sistema',
    titulo: 'Novo documento recebido',
    descricao: 'Cliente enviou contrato social atualizado para análise.',
    clienteId: '3',
    clienteNome: 'Serviços XYZ LTDA',
    dataHora: '2025-12-12T16:45:00',
    lido: true,
  },
];

const AlertasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAlertas, setSelectedAlertas] = useState<string[]>([]);
  const [alertas, setAlertas] = useState(mockAlertas);

  const tabs = [
    { label: 'Todos', count: alertas.length },
    { label: 'Críticos', count: alertas.filter(a => a.tipo === 'critico').length, color: 'error' },
    { label: 'Importantes', count: alertas.filter(a => a.tipo === 'importante').length, color: 'warning' },
    { label: 'Informativos', count: alertas.filter(a => a.tipo === 'informativo').length, color: 'info' },
    { label: 'Não lidos', count: alertas.filter(a => !a.lido).length },
  ];

  const filteredAlertas = alertas.filter(alerta => {
    const matchesSearch =
      alerta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alerta.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alerta.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 1) matchesTab = alerta.tipo === 'critico';
    if (activeTab === 2) matchesTab = alerta.tipo === 'importante';
    if (activeTab === 3) matchesTab = alerta.tipo === 'informativo';
    if (activeTab === 4) matchesTab = !alerta.lido;
    
    return matchesSearch && matchesTab;
  });

  const getTipoConfig = (tipo: string) => {
    switch (tipo) {
      case 'critico':
        return { color: 'error', icon: <ErrorIcon />, label: 'Crítico', bgColor: 'error.50' };
      case 'importante':
        return { color: 'warning', icon: <Warning />, label: 'Importante', bgColor: 'warning.50' };
      default:
        return { color: 'info', icon: <Info />, label: 'Informativo', bgColor: 'info.50' };
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'guia': return <Gavel />;
      case 'nota': return <Receipt />;
      case 'ticket': return <Assignment />;
      case 'sistema': return <Security />;
      case 'financeiro': return <Business />;
      default: return <Info />;
    }
  };

  const handleSelectAlerta = (id: string) => {
    setSelectedAlertas(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlertas.length === filteredAlertas.length) {
      setSelectedAlertas([]);
    } else {
      setSelectedAlertas(filteredAlertas.map(a => a.id));
    }
  };

  const handleMarcarLido = (ids: string[]) => {
    setAlertas(prev =>
      prev.map(a => ids.includes(a.id) ? { ...a, lido: true } : a)
    );
    setSelectedAlertas([]);
  };

  const handleExcluir = (ids: string[]) => {
    setAlertas(prev => prev.filter(a => !ids.includes(a.id)));
    setSelectedAlertas([]);
  };

  // Contadores
  const alertasCriticos = alertas.filter(a => a.tipo === 'critico' && !a.lido).length;
  const alertasImportantes = alertas.filter(a => a.tipo === 'importante' && !a.lido).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Central de Alertas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitore todos os alertas dos clientes em um só lugar
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Refresh />} variant="outlined">
            Atualizar
          </Button>
          <Button startIcon={<MarkEmailRead />} variant="contained">
            Marcar todos como lido
          </Button>
        </Box>
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alertasCriticos > 0 ? 'error.50' : 'background.paper' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                <ErrorIcon />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {alertasCriticos}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alertas Críticos
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alertasImportantes > 0 ? 'warning.50' : 'background.paper' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                <Warning />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                  {alertasImportantes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alertas Importantes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                <Info />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {alertas.filter(a => a.tipo === 'informativo').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Informativos
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                <CheckCircle />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {alertas.filter(a => a.lido).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolvidos
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
                      color={(tab.color as 'error' | 'warning' | 'info') || 'default'}
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: !tab.color && activeTab === index ? 'primary.main' : undefined,
                        color: !tab.color && activeTab === index ? 'white' : undefined,
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          {/* Filtros e Ações em Lote */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Buscar alertas..."
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedAlertas.length === filteredAlertas.length && filteredAlertas.length > 0}
                    indeterminate={selectedAlertas.length > 0 && selectedAlertas.length < filteredAlertas.length}
                    onChange={handleSelectAll}
                    size="small"
                  />
                }
                label="Selecionar todos"
              />
            </Box>
            {selectedAlertas.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={`${selectedAlertas.length} selecionados`}
                  size="small"
                  onDelete={() => setSelectedAlertas([])}
                />
                <Button
                  size="small"
                  startIcon={<MarkEmailRead />}
                  onClick={() => handleMarcarLido(selectedAlertas)}
                >
                  Marcar como lido
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleExcluir(selectedAlertas)}
                >
                  Excluir
                </Button>
              </Box>
            )}
          </Box>

          {/* Lista de Alertas */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredAlertas.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <NotificationsOff sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhum alerta encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Todos os alertas foram resolvidos ou filtrados
                </Typography>
              </Box>
            ) : (
              filteredAlertas.map((alerta) => {
                const config = getTipoConfig(alerta.tipo);
                return (
                  <Paper
                    key={alerta.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                      borderLeft: 4,
                      borderLeftColor: `${config.color}.main`,
                      bgcolor: alerta.lido ? 'transparent' : config.bgColor,
                      opacity: alerta.lido ? 0.8 : 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Checkbox
                      checked={selectedAlertas.includes(alerta.id)}
                      onChange={() => handleSelectAlerta(alerta.id)}
                      size="small"
                    />
                    <Avatar
                      sx={{
                        bgcolor: `${config.color}.light`,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getCategoriaIcon(alerta.categoria)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {alerta.titulo}
                        </Typography>
                        <Chip
                          label={config.label}
                          size="small"
                          color={config.color as 'error' | 'warning' | 'info'}
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                        {!alerta.lido && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {alerta.descricao}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          icon={<Business sx={{ fontSize: '14px !important' }} />}
                          label={alerta.clienteNome}
                          size="small"
                          variant="outlined"
                          sx={{ height: 24 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(alerta.dataHora), { addSuffix: true, locale: ptBR })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Ver detalhes">
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!alerta.lido && (
                        <Tooltip title="Marcar como lido">
                          <IconButton size="small" onClick={() => handleMarcarLido([alerta.id])}>
                            <CheckCircle fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Excluir">
                        <IconButton size="small" onClick={() => handleExcluir([alerta.id])}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                );
              })
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AlertasPage;
