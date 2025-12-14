import React, { useState } from 'react';
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

// Tipos para o histórico de acessos
interface AcessoLog {
  id: string;
  documentoId: string;
  documentoNome: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioAvatar?: string;
  acao: 'visualizar' | 'download' | 'compartilhar' | 'editar' | 'excluir' | 'upload';
  dataHora: string;
  ip?: string;
  dispositivo?: string;
  detalhes?: string;
}

// Mock data para histórico de acessos
const mockAcessosLog: AcessoLog[] = [
  {
    id: '1',
    documentoId: '1',
    documentoNome: 'Contrato_Social_Consolidado.pdf',
    usuarioId: 'user1',
    usuarioNome: 'João Silva',
    acao: 'visualizar',
    dataHora: new Date().toISOString(),
    ip: '192.168.1.100',
    dispositivo: 'Chrome - Windows',
  },
  {
    id: '2',
    documentoId: '1',
    documentoNome: 'Contrato_Social_Consolidado.pdf',
    usuarioId: 'user2',
    usuarioNome: 'Maria Souza',
    acao: 'download',
    dataHora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.105',
    dispositivo: 'Safari - macOS',
  },
  {
    id: '3',
    documentoId: '2',
    documentoNome: 'Balanço_Patrimonial_2024.xlsx',
    usuarioId: 'user1',
    usuarioNome: 'João Silva',
    acao: 'compartilhar',
    dataHora: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    dispositivo: 'Chrome - Windows',
    detalhes: 'Compartilhado com contador@empresa.com.br',
  },
  {
    id: '4',
    documentoId: '3',
    documentoNome: 'DAS_Novembro_2024.pdf',
    usuarioId: 'contador1',
    usuarioNome: 'Carlos Contador',
    acao: 'upload',
    dataHora: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ip: '10.0.0.50',
    dispositivo: 'Firefox - Linux',
  },
  {
    id: '5',
    documentoId: '1',
    documentoNome: 'Contrato_Social_Consolidado.pdf',
    usuarioId: 'user3',
    usuarioNome: 'Ana Costa',
    acao: 'editar',
    dataHora: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.110',
    dispositivo: 'Edge - Windows',
    detalhes: 'Atualizou nome do arquivo',
  },
  {
    id: '6',
    documentoId: '4',
    documentoNome: 'Folha_Pagamento_Nov2024.pdf',
    usuarioId: 'user1',
    usuarioNome: 'João Silva',
    acao: 'visualizar',
    dataHora: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    dispositivo: 'Mobile - Android',
  },
];

const acaoConfig: Record<AcessoLog['acao'], { label: string; icon: React.ReactElement; color: string }> = {
  visualizar: { label: 'Visualizou', icon: <Visibility fontSize="small" />, color: 'info' },
  download: { label: 'Baixou', icon: <Download fontSize="small" />, color: 'success' },
  compartilhar: { label: 'Compartilhou', icon: <Share fontSize="small" />, color: 'primary' },
  editar: { label: 'Editou', icon: <Edit fontSize="small" />, color: 'warning' },
  excluir: { label: 'Excluiu', icon: <Delete fontSize="small" />, color: 'error' },
  upload: { label: 'Enviou', icon: <Description fontSize="small" />, color: 'secondary' },
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
  const [filterAcao, setFilterAcao] = useState<AcessoLog['acao'] | 'todos'>('todos');

  // Filtrar logs
  const filteredLogs = mockAcessosLog.filter(log => {
    // Se documento específico foi fornecido, filtrar por ele
    if (documento && log.documentoId !== documento.id) {
      return false;
    }

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        log.documentoNome.toLowerCase().includes(term) ||
        log.usuarioNome.toLowerCase().includes(term) ||
        log.detalhes?.toLowerCase().includes(term);
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
    const date = format(parseISO(log.dataHora), 'yyyy-MM-dd');
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
          {Object.keys(groupedByDate).length === 0 ? (
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
                    const config = acaoConfig[log.acao];
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
                                {log.usuarioNome}
                              </Typography>
                              <Chip
                                icon={config.icon}
                                label={config.label}
                                size="small"
                                color={config.color as any}
                                sx={{ height: 22 }}
                              />
                              {!documento && (
                                <Typography variant="body2" color="text.secondary" component="span">
                                  {log.documentoNome}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {format(parseISO(log.dataHora), 'HH:mm', { locale: ptBR })}
                                  {' • '}
                                  {formatDistanceToNow(parseISO(log.dataHora), { addSuffix: true, locale: ptBR })}
                                </Typography>
                              </Box>
                              {log.dispositivo && (
                                <Typography variant="caption" color="text.disabled">
                                  {log.dispositivo}
                                </Typography>
                              )}
                              {log.detalhes && (
                                <Typography variant="caption" color="primary.main">
                                  {log.detalhes}
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
                  const count = mockAcessosLog.filter(
                    log => log.acao === key && (!documento || log.documentoId === documento?.id)
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
                {['João Silva', 'Maria Souza', 'Carlos Contador'].map((usuario) => {
                  const count = mockAcessosLog.filter(
                    log => log.usuarioNome === usuario && (!documento || log.documentoId === documento?.id)
                  ).length;
                  return (
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
                          {usuario[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={usuario} />
                      <Chip label={`${count} ações`} size="small" variant="outlined" />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button variant="outlined" startIcon={<Download />}>
          Exportar Relatório
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoricoAcessosDialog;
