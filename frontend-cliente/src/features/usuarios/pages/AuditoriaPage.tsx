import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Avatar,
  Grid,
  Paper,
  Tabs,
  Tab,
  alpha,
  Button,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Search,

  Visibility,
  Download,
  Refresh,
  Person,
  Login,
  Logout,
  Edit,
  Delete,
  Add,
  Settings,
  Description,
  Receipt,
  Upload,
  Email,
  Security,
  History,
  CalendarToday,
} from '@mui/icons-material';
import { format, parseISO, subDays, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Tipos
interface AuditLog {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  acao: AcaoTipo;
  descricao: string;
  modulo: string;
  ip: string;
  userAgent: string;
  dataHora: string;
  detalhes?: Record<string, any>;
}

type AcaoTipo =
  | 'login'
  | 'logout'
  | 'criar'
  | 'editar'
  | 'excluir'
  | 'visualizar'
  | 'download'
  | 'upload'
  | 'enviar'
  | 'configurar'
  | 'outros';

interface AcessoLog {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  ip: string;
  dispositivo: string;
  navegador: string;
  localizacao: string;
  dataHora: string;
  sucesso: boolean;
  motivo?: string;
}

// Mock Data - Logs de Auditoria
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    acao: 'login',
    descricao: 'Login realizado com sucesso',
    modulo: 'Autenticação',
    ip: '189.45.123.45',
    userAgent: 'Chrome 120 / Windows 10',
    dataHora: new Date().toISOString(),
  },
  {
    id: '2',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    acao: 'criar',
    descricao: 'Emitiu NF-e #1234 para Tech Solutions',
    modulo: 'Notas Fiscais',
    ip: '189.45.123.45',
    userAgent: 'Chrome 120 / Windows 10',
    dataHora: subHours(new Date(), 1).toISOString(),
    detalhes: { numeroNota: '1234', tomador: 'Tech Solutions', valor: 5000 },
  },
  {
    id: '3',
    usuarioId: '2',
    usuarioNome: 'Maria Santos',
    usuarioEmail: 'maria@empresa.com.br',
    acao: 'upload',
    descricao: 'Enviou documento "Contrato_2024.pdf"',
    modulo: 'Documentos',
    ip: '200.178.45.67',
    userAgent: 'Firefox 121 / macOS',
    dataHora: subHours(new Date(), 2).toISOString(),
  },
  {
    id: '4',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    acao: 'editar',
    descricao: 'Alterou dados do tomador "XYZ Consultoria"',
    modulo: 'Tomadores',
    ip: '189.45.123.45',
    userAgent: 'Chrome 120 / Windows 10',
    dataHora: subHours(new Date(), 3).toISOString(),
  },
  {
    id: '5',
    usuarioId: '3',
    usuarioNome: 'Carlos Oliveira',
    usuarioEmail: 'carlos@empresa.com.br',
    acao: 'download',
    descricao: 'Baixou guia DAS - Competência 11/2024',
    modulo: 'Guias',
    ip: '177.92.45.123',
    userAgent: 'Safari 17 / iOS',
    dataHora: subHours(new Date(), 5).toISOString(),
  },
  {
    id: '6',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    acao: 'configurar',
    descricao: 'Atualizou configurações fiscais da empresa',
    modulo: 'Configurações',
    ip: '189.45.123.45',
    userAgent: 'Chrome 120 / Windows 10',
    dataHora: subDays(new Date(), 1).toISOString(),
  },
  {
    id: '7',
    usuarioId: '2',
    usuarioNome: 'Maria Santos',
    usuarioEmail: 'maria@empresa.com.br',
    acao: 'enviar',
    descricao: 'Enviou mensagem para o escritório',
    modulo: 'Comunicação',
    ip: '200.178.45.67',
    userAgent: 'Firefox 121 / macOS',
    dataHora: subDays(new Date(), 1).toISOString(),
  },
  {
    id: '8',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    acao: 'excluir',
    descricao: 'Cancelou NF-e #1230',
    modulo: 'Notas Fiscais',
    ip: '189.45.123.45',
    userAgent: 'Chrome 120 / Windows 10',
    dataHora: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '9',
    usuarioId: '3',
    usuarioNome: 'Carlos Oliveira',
    usuarioEmail: 'carlos@empresa.com.br',
    acao: 'visualizar',
    descricao: 'Visualizou relatório de faturamento',
    modulo: 'Relatórios',
    ip: '177.92.45.123',
    userAgent: 'Safari 17 / iOS',
    dataHora: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '10',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    acao: 'logout',
    descricao: 'Logout realizado',
    modulo: 'Autenticação',
    ip: '189.45.123.45',
    userAgent: 'Chrome 120 / Windows 10',
    dataHora: subDays(new Date(), 3).toISOString(),
  },
];

// Mock Data - Logs de Acesso
const mockAcessoLogs: AcessoLog[] = [
  {
    id: '1',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    ip: '189.45.123.45',
    dispositivo: 'Desktop',
    navegador: 'Chrome 120',
    localizacao: 'São Paulo, SP',
    dataHora: new Date().toISOString(),
    sucesso: true,
  },
  {
    id: '2',
    usuarioId: '2',
    usuarioNome: 'Maria Santos',
    usuarioEmail: 'maria@empresa.com.br',
    ip: '200.178.45.67',
    dispositivo: 'MacBook Pro',
    navegador: 'Firefox 121',
    localizacao: 'Rio de Janeiro, RJ',
    dataHora: subHours(new Date(), 2).toISOString(),
    sucesso: true,
  },
  {
    id: '3',
    usuarioId: '3',
    usuarioNome: 'Carlos Oliveira',
    usuarioEmail: 'carlos@empresa.com.br',
    ip: '177.92.45.123',
    dispositivo: 'iPhone 15',
    navegador: 'Safari 17',
    localizacao: 'Belo Horizonte, MG',
    dataHora: subHours(new Date(), 5).toISOString(),
    sucesso: true,
  },
  {
    id: '4',
    usuarioId: '1',
    usuarioNome: 'João da Silva',
    usuarioEmail: 'joao@empresa.com.br',
    ip: '45.178.23.89',
    dispositivo: 'Desktop',
    navegador: 'Chrome 120',
    localizacao: 'Curitiba, PR',
    dataHora: subDays(new Date(), 1).toISOString(),
    sucesso: false,
    motivo: 'Senha incorreta',
  },
  {
    id: '5',
    usuarioId: '2',
    usuarioNome: 'Maria Santos',
    usuarioEmail: 'maria@empresa.com.br',
    ip: '200.178.45.67',
    dispositivo: 'MacBook Pro',
    navegador: 'Firefox 121',
    localizacao: 'Rio de Janeiro, RJ',
    dataHora: subDays(new Date(), 1).toISOString(),
    sucesso: true,
  },
];

// Helpers
const getAcaoIcon = (acao: AcaoTipo) => {
  const icons: Record<AcaoTipo, React.ReactElement> = {
    login: <Login fontSize="small" />,
    logout: <Logout fontSize="small" />,
    criar: <Add fontSize="small" />,
    editar: <Edit fontSize="small" />,
    excluir: <Delete fontSize="small" />,
    visualizar: <Visibility fontSize="small" />,
    download: <Download fontSize="small" />,
    upload: <Upload fontSize="small" />,
    enviar: <Email fontSize="small" />,
    configurar: <Settings fontSize="small" />,
    outros: <History fontSize="small" />,
  };
  return icons[acao];
};

const getAcaoColor = (acao: AcaoTipo): 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' => {
  const colors: Record<AcaoTipo, 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary'> = {
    login: 'success',
    logout: 'info',
    criar: 'primary',
    editar: 'warning',
    excluir: 'error',
    visualizar: 'info',
    download: 'secondary',
    upload: 'primary',
    enviar: 'info',
    configurar: 'warning',
    outros: 'secondary',
  };
  return colors[acao];
};

const getModuloIcon = (modulo: string) => {
  const icons: Record<string, React.ReactElement> = {
    Autenticação: <Security fontSize="small" />,
    'Notas Fiscais': <Receipt fontSize="small" />,
    Documentos: <Description fontSize="small" />,
    Tomadores: <Person fontSize="small" />,
    Guias: <CalendarToday fontSize="small" />,
    Configurações: <Settings fontSize="small" />,
    Comunicação: <Email fontSize="small" />,
    Relatórios: <Download fontSize="small" />,
  };
  return icons[modulo] || <History fontSize="small" />;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 16 }}>
    {value === index && children}
  </div>
);

const AuditoriaPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroAcao, setFiltroAcao] = useState('');
  const [filtroModulo, setFiltroModulo] = useState('');
  const [dataInicio, setDataInicio] = useState<Date | null>(subDays(new Date(), 30));
  const [dataFim, setDataFim] = useState<Date | null>(new Date());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Extrair usuários únicos
  const usuarios = useMemo(() => {
    const uniqueUsers = new Map<string, { id: string; nome: string; email: string }>();
    mockAuditLogs.forEach((log) => {
      if (!uniqueUsers.has(log.usuarioId)) {
        uniqueUsers.set(log.usuarioId, {
          id: log.usuarioId,
          nome: log.usuarioNome,
          email: log.usuarioEmail,
        });
      }
    });
    return Array.from(uniqueUsers.values());
  }, []);

  // Extrair módulos únicos
  const modulos = useMemo(() => {
    return [...new Set(mockAuditLogs.map((log) => log.modulo))];
  }, []);

  // Filtrar logs de auditoria
  const filteredAuditLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchSearch =
        log.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.usuarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm);
      const matchUsuario = !filtroUsuario || log.usuarioId === filtroUsuario;
      const matchAcao = !filtroAcao || log.acao === filtroAcao;
      const matchModulo = !filtroModulo || log.modulo === filtroModulo;
      const logDate = parseISO(log.dataHora);
      const matchDataInicio = !dataInicio || logDate >= dataInicio;
      const matchDataFim = !dataFim || logDate <= dataFim;

      return matchSearch && matchUsuario && matchAcao && matchModulo && matchDataInicio && matchDataFim;
    });
  }, [searchTerm, filtroUsuario, filtroAcao, filtroModulo, dataInicio, dataFim]);

  // Filtrar logs de acesso
  const filteredAcessoLogs = useMemo(() => {
    return mockAcessoLogs.filter((log) => {
      const matchSearch =
        log.usuarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm) ||
        log.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchUsuario = !filtroUsuario || log.usuarioId === filtroUsuario;

      return matchSearch && matchUsuario;
    });
  }, [searchTerm, filtroUsuario]);

  // Estatísticas
  const stats = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const loginsHoje = mockAcessoLogs.filter(
      (log) => parseISO(log.dataHora) >= hoje && log.sucesso
    ).length;

    const acoesHoje = mockAuditLogs.filter(
      (log) => parseISO(log.dataHora) >= hoje
    ).length;

    const tentativasFalhas = mockAcessoLogs.filter((log) => !log.sucesso).length;

    const usuariosAtivos = new Set(
      mockAcessoLogs
        .filter((log) => log.sucesso && parseISO(log.dataHora) >= subDays(new Date(), 7))
        .map((log) => log.usuarioId)
    ).size;

    return { loginsHoje, acoesHoje, tentativasFalhas, usuariosAtivos };
  }, []);

  const handleExportCSV = () => {
    // Simular exportação
    alert('Exportando relatório de auditoria em CSV...');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Auditoria
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acompanhe todas as ações e acessos dos usuários da empresa
        </Typography>
      </Box>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <Login />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {stats.loginsHoje}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Logins hoje
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <History />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {stats.acoesHoje}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ações hoje
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <Security />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {stats.tentativasFalhas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tentativas falhas
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {stats.usuariosAtivos}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuários ativos (7d)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs e Conteúdo */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="Log de Ações" icon={<History />} iconPosition="start" />
              <Tab label="Histórico de Acessos" icon={<Login />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Filtros */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Usuário</InputLabel>
                <Select
                  value={filtroUsuario}
                  label="Usuário"
                  onChange={(e: SelectChangeEvent) => setFiltroUsuario(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {usuarios.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {tabValue === 0 && (
              <>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ação</InputLabel>
                    <Select
                      value={filtroAcao}
                      label="Ação"
                      onChange={(e: SelectChangeEvent) => setFiltroAcao(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="login">Login</MenuItem>
                      <MenuItem value="logout">Logout</MenuItem>
                      <MenuItem value="criar">Criar</MenuItem>
                      <MenuItem value="editar">Editar</MenuItem>
                      <MenuItem value="excluir">Excluir</MenuItem>
                      <MenuItem value="visualizar">Visualizar</MenuItem>
                      <MenuItem value="download">Download</MenuItem>
                      <MenuItem value="upload">Upload</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Módulo</InputLabel>
                    <Select
                      value={filtroModulo}
                      label="Módulo"
                      onChange={(e: SelectChangeEvent) => setFiltroModulo(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {modulos.map((modulo) => (
                        <MenuItem key={modulo} value={modulo}>
                          {modulo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6} md={tabValue === 0 ? 1.5 : 2}>
              <DatePicker
                label="Data início"
                value={dataInicio}
                onChange={(date) => setDataInicio(date)}
                slotProps={{
                  textField: { size: 'small', fullWidth: true },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={tabValue === 0 ? 1.5 : 2}>
              <DatePicker
                label="Data fim"
                value={dataFim}
                onChange={(date) => setDataFim(date)}
                slotProps={{
                  textField: { size: 'small', fullWidth: true },
                }}
              />
            </Grid>
          </Grid>

          {/* Ações */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              size="small"
              onClick={() => {
                setSearchTerm('');
                setFiltroUsuario('');
                setFiltroAcao('');
                setFiltroModulo('');
              }}
            >
              Limpar filtros
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              size="small"
              onClick={handleExportCSV}
            >
              Exportar CSV
            </Button>
          </Box>

          {/* Tab: Log de Ações */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data/Hora</TableCell>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Ação</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Módulo</TableCell>
                    <TableCell>IP</TableCell>
                    <TableCell align="center">Detalhes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAuditLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {format(parseISO(log.dataHora), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                              {log.usuarioNome.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {log.usuarioNome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {log.usuarioEmail}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getAcaoIcon(log.acao)}
                            label={log.acao}
                            size="small"
                            color={getAcaoColor(log.acao)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 250 }} noWrap>
                            {log.descricao}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getModuloIcon(log.modulo)}
                            label={log.modulo}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {log.ip}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalhes">
                            <IconButton size="small">
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredAuditLogs.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Linhas por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </TabPanel>

          {/* Tab: Histórico de Acessos */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data/Hora</TableCell>
                    <TableCell>Usuário</TableCell>
                    <TableCell>IP</TableCell>
                    <TableCell>Dispositivo</TableCell>
                    <TableCell>Navegador</TableCell>
                    <TableCell>Localização</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAcessoLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {format(parseISO(log.dataHora), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                              {log.usuarioNome.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {log.usuarioNome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {log.usuarioEmail}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {log.ip}
                          </Typography>
                        </TableCell>
                        <TableCell>{log.dispositivo}</TableCell>
                        <TableCell>{log.navegador}</TableCell>
                        <TableCell>{log.localizacao}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={log.sucesso ? 'Sucesso' : 'Falhou'}
                            size="small"
                            color={log.sucesso ? 'success' : 'error'}
                          />
                          {!log.sucesso && log.motivo && (
                            <Typography variant="caption" display="block" color="error">
                              {log.motivo}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredAcessoLogs.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Linhas por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuditoriaPage;
