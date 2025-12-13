import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Visibility as VisibilityIcon,
  SupervisorAccount as OperadorIcon,
  Email as EmailIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  perfil: 'admin' | 'operador' | 'visualizador';
  ativo: boolean;
  ultimoAcesso: string | null;
  convitePendente: boolean;
  criadoEm: string;
}

// Mock data
const MOCK_USUARIOS: Usuario[] = [
  {
    id: '1',
    nome: 'João da Silva',
    email: 'joao@empresa.com.br',
    cpf: '123.456.789-00',
    perfil: 'admin',
    ativo: true,
    ultimoAcesso: '2025-01-10T14:30:00',
    convitePendente: false,
    criadoEm: '2024-06-15T10:00:00',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@empresa.com.br',
    cpf: '987.654.321-00',
    perfil: 'operador',
    ativo: true,
    ultimoAcesso: '2025-01-09T09:15:00',
    convitePendente: false,
    criadoEm: '2024-08-20T14:00:00',
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    email: 'carlos@empresa.com.br',
    cpf: '456.789.123-00',
    perfil: 'visualizador',
    ativo: true,
    ultimoAcesso: '2025-01-08T16:45:00',
    convitePendente: false,
    criadoEm: '2024-10-05T08:30:00',
  },
  {
    id: '4',
    nome: 'Ana Paula',
    email: 'ana@empresa.com.br',
    cpf: '789.123.456-00',
    perfil: 'operador',
    ativo: false,
    ultimoAcesso: '2024-12-20T11:00:00',
    convitePendente: false,
    criadoEm: '2024-07-10T09:00:00',
  },
  {
    id: '5',
    nome: 'Pedro Henrique',
    email: 'pedro@empresa.com.br',
    cpf: '321.654.987-00',
    perfil: 'visualizador',
    ativo: true,
    ultimoAcesso: null,
    convitePendente: true,
    criadoEm: '2025-01-05T15:00:00',
  },
];

const PERFIS = {
  admin: { label: 'Administrador', color: 'error' as const, icon: <AdminIcon fontSize="small" /> },
  operador: { label: 'Operador', color: 'primary' as const, icon: <OperadorIcon fontSize="small" /> },
  visualizador: { label: 'Visualizador', color: 'default' as const, icon: <VisibilityIcon fontSize="small" /> },
};

const PERMISSOES = {
  admin: [
    'Acesso total ao sistema',
    'Gerenciar usuários',
    'Emitir e cancelar notas fiscais',
    'Upload e exclusão de documentos',
    'Configurações da empresa',
  ],
  operador: [
    'Emitir notas fiscais',
    'Gerenciar tomadores',
    'Upload de documentos',
    'Visualizar relatórios',
  ],
  visualizador: [
    'Visualizar notas fiscais',
    'Visualizar documentos',
    'Visualizar relatórios',
    'Download de arquivos',
  ],
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK_USUARIOS);
  const [busca, setBusca] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [dialogConvite, setDialogConvite] = useState(false);
  const [dialogEditar, setDialogEditar] = useState(false);
  const [dialogExcluir, setDialogExcluir] = useState(false);
  const [linkConvite, setLinkConvite] = useState('');

  // Form states
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    cpf: '',
    perfil: 'operador' as 'admin' | 'operador' | 'visualizador',
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, usuario: Usuario) => {
    setAnchorEl(event.currentTarget);
    setUsuarioSelecionado(usuario);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConvidar = () => {
    setNovoUsuario({ nome: '', email: '', cpf: '', perfil: 'operador' });
    setDialogConvite(true);
  };

  const handleEnviarConvite = () => {
    // Simula envio de convite
    const novoId = (usuarios.length + 1).toString();
    const novo: Usuario = {
      id: novoId,
      ...novoUsuario,
      ativo: true,
      ultimoAcesso: null,
      convitePendente: true,
      criadoEm: new Date().toISOString(),
    };
    setUsuarios([...usuarios, novo]);
    setLinkConvite(`https://app.cnscontabilidade.com.br/convite/${novoId}`);
  };

  const handleFecharConvite = () => {
    setDialogConvite(false);
    setLinkConvite('');
  };

  const handleEditar = () => {
    handleMenuClose();
    if (usuarioSelecionado) {
      setNovoUsuario({
        nome: usuarioSelecionado.nome,
        email: usuarioSelecionado.email,
        cpf: usuarioSelecionado.cpf,
        perfil: usuarioSelecionado.perfil,
      });
      setDialogEditar(true);
    }
  };

  const handleSalvarEdicao = () => {
    if (usuarioSelecionado) {
      setUsuarios(usuarios.map(u => 
        u.id === usuarioSelecionado.id 
          ? { ...u, ...novoUsuario }
          : u
      ));
      setDialogEditar(false);
    }
  };

  const handleToggleAtivo = () => {
    handleMenuClose();
    if (usuarioSelecionado) {
      setUsuarios(usuarios.map(u =>
        u.id === usuarioSelecionado.id
          ? { ...u, ativo: !u.ativo }
          : u
      ));
    }
  };

  const handleExcluir = () => {
    handleMenuClose();
    setDialogExcluir(true);
  };

  const handleConfirmarExclusao = () => {
    if (usuarioSelecionado) {
      setUsuarios(usuarios.filter(u => u.id !== usuarioSelecionado.id));
      setDialogExcluir(false);
    }
  };

  const handleReenviarConvite = () => {
    handleMenuClose();
    // Simula reenvio
    alert('Convite reenviado com sucesso!');
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase()) ||
    u.cpf.includes(busca)
  );

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.ativo && !u.convitePendente).length,
    inativos: usuarios.filter(u => !u.ativo).length,
    pendentes: usuarios.filter(u => u.convitePendente).length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Gestão de Usuários
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os usuários que têm acesso ao sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleConvidar}
        >
          Convidar Usuário
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Usuários
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.ativos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ativos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.inativos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inativos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.pendentes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Convites Pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome, e-mail ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Perfil</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Último Acesso</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosFiltrados.map((usuario) => (
              <TableRow 
                key={usuario.id}
                sx={{ 
                  opacity: usuario.ativo ? 1 : 0.6,
                  bgcolor: usuario.convitePendente 
                    ? (theme) => alpha(theme.palette.warning.main, 0.05) 
                    : 'inherit'
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: PERFIS[usuario.perfil].color + '.main' }}>
                      {usuario.nome.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {usuario.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {usuario.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={PERFIS[usuario.perfil].icon}
                    label={PERFIS[usuario.perfil].label}
                    color={PERFIS[usuario.perfil].color}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {usuario.convitePendente ? (
                    <Chip
                      icon={<EmailIcon fontSize="small" />}
                      label="Convite Pendente"
                      color="warning"
                      size="small"
                    />
                  ) : usuario.ativo ? (
                    <Chip
                      icon={<CheckCircleIcon fontSize="small" />}
                      label="Ativo"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<BlockIcon fontSize="small" />}
                      label="Inativo"
                      color="default"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {usuario.ultimoAcesso ? (
                    <Typography variant="body2">
                      {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nunca acessou
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, usuario)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {usuarioSelecionado?.convitePendente && (
          <MenuItem onClick={handleReenviarConvite}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reenviar Convite</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleEditar}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleAtivo}>
          <ListItemIcon>
            {usuarioSelecionado?.ativo ? (
              <BlockIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {usuarioSelecionado?.ativo ? 'Desativar' : 'Ativar'}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleExcluir} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog Convidar Usuário */}
      <Dialog open={dialogConvite} onClose={handleFecharConvite} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            Convidar Novo Usuário
          </Box>
        </DialogTitle>
        <DialogContent>
          {linkConvite ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Convite Enviado!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Um e-mail foi enviado para {novoUsuario.email} com instruções de acesso.
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Link de convite (válido por 48h):
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={linkConvite}
                    InputProps={{ readOnly: true }}
                  />
                  <Tooltip title="Copiar link">
                    <IconButton onClick={() => navigator.clipboard.writeText(linkConvite)}>
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                O usuário receberá um e-mail com instruções para criar sua senha e acessar o sistema.
              </Alert>

              <TextField
                fullWidth
                label="Nome Completo"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="CPF"
                value={novoUsuario.cpf}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, cpf: e.target.value })}
                placeholder="000.000.000-00"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Perfil de Acesso</InputLabel>
                <Select
                  value={novoUsuario.perfil}
                  label="Perfil de Acesso"
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, perfil: e.target.value as any })}
                >
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminIcon fontSize="small" color="error" />
                      Administrador
                    </Box>
                  </MenuItem>
                  <MenuItem value="operador">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <OperadorIcon fontSize="small" color="primary" />
                      Operador
                    </Box>
                  </MenuItem>
                  <MenuItem value="visualizador">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VisibilityIcon fontSize="small" />
                      Visualizador
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Permissões do perfil "{PERFIS[novoUsuario.perfil].label}":
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {PERMISSOES[novoUsuario.perfil].map((perm, idx) => (
                    <Typography component="li" variant="body2" key={idx} color="text.secondary">
                      {perm}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {linkConvite ? (
            <Button onClick={handleFecharConvite} variant="contained">
              Fechar
            </Button>
          ) : (
            <>
              <Button onClick={handleFecharConvite}>Cancelar</Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleEnviarConvite}
                disabled={!novoUsuario.nome || !novoUsuario.email || !novoUsuario.cpf}
              >
                Enviar Convite
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog Editar Usuário */}
      <Dialog open={dialogEditar} onClose={() => setDialogEditar(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nome Completo"
              value={novoUsuario.nome}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={novoUsuario.email}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="CPF"
              value={novoUsuario.cpf}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, cpf: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth>
              <InputLabel>Perfil de Acesso</InputLabel>
              <Select
                value={novoUsuario.perfil}
                label="Perfil de Acesso"
                onChange={(e) => setNovoUsuario({ ...novoUsuario, perfil: e.target.value as any })}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="operador">Operador</MenuItem>
                <MenuItem value="visualizador">Visualizador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogEditar(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarEdicao}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <Dialog open={dialogExcluir} onClose={() => setDialogExcluir(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta ação não pode ser desfeita!
          </Alert>
          <Typography>
            Tem certeza que deseja excluir o usuário <strong>{usuarioSelecionado?.nome}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogExcluir(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleConfirmarExclusao}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
