import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Divider,
  CircularProgress,

} from '@mui/material';
import {
  Close,
  Search,
  Visibility,
  Download,
  Share,
  Edit,
  Delete,
  History,
  Person,
  Description,
  AccessTime,
  FilterList,
} from '@mui/icons-material';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Document as DocType } from '../../../types';
import documentosService from '../../../services/documentosService';

// Tipo para log de acesso (replicado do documentosService)
interface AcessoLog {
  id: string;
  acao: string;
  usuario: string;
  data: string;
  ip: string;
}

// Tipos para o histórico de acessos
type AcaoType = 'Visualização' | 'Download' | 'Compartilhamento' | 'Edição' | 'Exclusão' | 'Upload';

const acaoConfig: Record<string, { label: string; icon: React.ReactElement; color: string }> = {
  'Visualização': { label: 'Visualizou', icon: <Visibility fontSize="small" />, color: 'info' },
  'Download': { label: 'Baixou', icon: <Download fontSize="small" />, color: 'success' },
  'Compartilhamento': { label: 'Compartilhou', icon: <Share fontSize="small" />, color: 'primary' },
  'Edição': { label: 'Editou', icon: <Edit fontSize="small" />, color: 'warning' },
  'Exclusão': { label: 'Excluiu', icon: <Delete fontSize="small" />, color: 'error' },
  'Upload': { label: 'Enviou', icon: <Description fontSize="small" />, color: 'secondary' },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

interface HistoricoAcessosDialogProps {
  open: boolean;
  onClose: () => void;
  documento?: DocType | null; // Se fornecido, filtra por documento específico
}

const HistoricoAcessosDialog: React.FC<HistoricoAcessosDialogProps> = ({
  open,
  onClose,
  documento,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAcao, setFilterAcao] = useState<string>('todos');
  const [acessosLog, setAcessosLog] = useState<AcessoLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar histórico quando dialog abre
  useEffect(() => {
    if (open && documento?.id) {
      const fetchHistorico = async () => {
        setLoading(true);
        setError(null);
        try {
          const historico = await documentosService.getHistorico(documento.id);
          setAcessosLog(historico);
        } catch (err) {
          console.error('Erro ao buscar histórico:', err);
          setError('Erro ao carregar histórico de acessos');
          setAcessosLog([]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistorico();
    } else if (!open) {
      // Limpar estado quando fechar
      setAcessosLog([]);
      setSearchTerm('');
      setFilterAcao('todos');
    }
  }, [open, documento?.id]);

  // Filtrar logs
  const filteredLogs = acessosLog.filter(log => {
    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        log.usuario.toLowerCase().includes(term) ||
        log.acao.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    // Filtro de ação
    if (filterAcao !== 'todos' && log.acao !== filterAcao) {
      return false;
    }

    return true;
  });

  // Agrupar por data
  const groupedByDate = filteredLogs.reduce((acc, log) => {
    const date = format(parseISO(log.data), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, AcessoLog[]>);

  const getFormattedDateLabel = (dateStr: string): string => {
    const date = parseISO(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Hoje';
    }
    if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Ontem';
    }
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { minHeight: '60vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History color="primary" />
          <Box>
            <Typography variant="h6" component="span">
              Histórico de Acessos
            </Typography>
            {documento && (
              <Typography variant="body2" color="text.secondary">
                {documento.nome}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Todos os Acessos" />
            <Tab label="Estatísticas" />
          </Tabs>
        </Box>

        {/* Tab: Todos os Acessos */}
        <TabPanel value={activeTab} index={0}>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Buscar por documento ou usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <FilterList color="action" fontSize="small" />
              <Chip
                label="Todos"
                size="small"
                variant={filterAcao === 'todos' ? 'filled' : 'outlined'}
                onClick={() => setFilterAcao('todos')}
                color={filterAcao === 'todos' ? 'primary' : 'default'}
              />
              {Object.entries(acaoConfig).map(([key, config]) => (
                <Chip
                  key={key}
                  icon={config.icon}
                  label={config.label}
                  size="small"
                  variant={filterAcao === key ? 'filled' : 'outlined'}
                  onClick={() => setFilterAcao(key as AcessoLog['acao'])}
                  color={filterAcao === key ? config.color as any : 'default'}
                />
              ))}
            </Box>
          </Box>

          {/* Lista de Acessos */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography color="text.secondary">
                Carregando histórico...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <History sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography color="error">
                {error}
              </Typography>
            </Box>
          ) : Object.keys(groupedByDate).length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <History sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                Nenhum registro de acesso encontrado
              </Typography>
            </Box>
          ) : (
            Object.entries(groupedByDate).map(([date, logs]) => (
              <Box key={date} sx={{ mb: 3 }}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  {getFormattedDateLabel(date + 'T00:00:00')}
                </Typography>
                <List disablePadding>
                  {logs.map((log) => {
                    const config = acaoConfig[log.acao] || { label: log.acao, icon: <History fontSize="small" />, color: 'default' };
                    return (
                      <ListItem
                        key={log.id}
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          mb: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha((theme.palette[config.color as keyof typeof theme.palette] as any)?.main || theme.palette.grey[500], 0.1) }}>
                            <Person sx={{ color: `${config.color}.main` }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle2" component="span">
                                {log.usuario}
                              </Typography>
                              <Chip
                                icon={config.icon}
                                label={config.label}
                                size="small"
                                color={config.color as any}
                                sx={{ height: 22 }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {format(parseISO(log.data), 'HH:mm', { locale: ptBR })}
                                  {' • '}
                                  {formatDistanceToNow(parseISO(log.data), { addSuffix: true, locale: ptBR })}
                                </Typography>
                              </Box>
                              {log.ip && log.ip !== '-' && (
                                <Typography variant="caption" color="text.disabled">
                                  IP: {log.ip}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            ))
          )}
        </TabPanel>

        {/* Tab: Estatísticas */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Resumo de Ações */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Resumo de Ações
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {Object.entries(acaoConfig).map(([key, config]) => {
                  const count = acessosLog.filter(
                    log => log.acao === key
                  ).length;
                  return (
                    <Box
                      key={key}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha((theme.palette[config.color as keyof typeof theme.palette] as any)?.main || theme.palette.grey[500], 0.1),
                        minWidth: 120,
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ color: `${config.color}.main`, mb: 1 }}>
                        {config.icon}
                      </Box>
                      <Typography variant="h5" fontWeight={700}>
                        {count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {config.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Divider />

            {/* Usuários mais ativos */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Usuários Mais Ativos
              </Typography>
              <List disablePadding>
                {/* Agrupar por usuário */}
                {Object.entries(
                  acessosLog.reduce((acc, log) => {
                    acc[log.usuario] = (acc[log.usuario] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([usuario, count]) => (
                    <ListItem
                      key={usuario}
                      sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {usuario[0]?.toUpperCase() || '?'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={usuario} />
                      <Chip label={`${count} ações`} size="small" variant="outlined" />
                    </ListItem>
                  ))}
                {acessosLog.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Nenhum acesso registrado
                  </Typography>
                )}
              </List>
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoricoAcessosDialog;
