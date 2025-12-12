import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  MoreVert,
  Business,
  Person,
  Visibility,
  Close,
  FileDownload,
  ContentCopy,
  CloudSync,
} from '@mui/icons-material';
import type { Tomador } from '../../../types';

// Mock data
const mockTomadores: Tomador[] = [
  {
    id: '1',
    tipo: 'pj',
    documento: '12345678000190',
    razaoSocial: 'Tech Solutions LTDA',
    nomeFantasia: 'TechSol',
    inscricaoMunicipal: '12345678',
    inscricaoEstadual: '123456789012',
    endereco: {
      cep: '01310100',
      logradouro: 'Av Paulista',
      numero: '1000',
      complemento: 'Sala 1001',
      bairro: 'Bela Vista',
      cidade: 'SÃ£o Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
    },
    email: 'contato@techsolutions.com.br',
    telefone: '(11) 99999-0001',
    ativo: true,
    totalNotas: 15,
    faturamentoTotal: 67500,
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-12-01T14:30:00',
  },
  {
    id: '2',
    tipo: 'pj',
    documento: '98765432000110',
    razaoSocial: 'Consultoria Alpha S.A',
    nomeFantasia: 'Alpha',
    inscricaoMunicipal: '87654321',
    endereco: {
      cep: '04543011',
      logradouro: 'Av Faria Lima',
      numero: '2000',
      complemento: 'Andar 15',
      bairro: 'Itaim Bibi',
      cidade: 'SÃ£o Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
    },
    email: 'financeiro@alpha.com.br',
    telefone: '(11) 99999-0002',
    ativo: true,
    totalNotas: 8,
    faturamentoTotal: 32000,
    createdAt: '2024-03-20T09:00:00',
    updatedAt: '2024-11-15T11:00:00',
  },
  {
    id: '3',
    tipo: 'pf',
    documento: '12345678901',
    nome: 'JoÃ£o Carlos Silva',
    endereco: {
      cep: '01310100',
      logradouro: 'Rua Augusta',
      numero: '500',
      complemento: 'Apto 42',
      bairro: 'ConsolaÃ§Ã£o',
      cidade: 'SÃ£o Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
    },
    email: 'joao.silva@email.com',
    telefone: '(11) 98888-0003',
    ativo: true,
    totalNotas: 3,
    faturamentoTotal: 2550,
    createdAt: '2024-06-01T14:00:00',
    updatedAt: '2024-12-05T16:00:00',
  },
  {
    id: '4',
    tipo: 'pj',
    documento: '55566677000188',
    razaoSocial: 'Startup Digital ME',
    nomeFantasia: 'DigiStart',
    endereco: {
      cep: '04547004',
      logradouro: 'Rua Funchal',
      numero: '418',
      bairro: 'Vila OlÃ­mpia',
      cidade: 'SÃ£o Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
    },
    email: 'contato@digistart.com.br',
    telefone: '(11) 97777-0004',
    ativo: true,
    totalNotas: 5,
    faturamentoTotal: 12500,
    createdAt: '2024-05-10T08:00:00',
    updatedAt: '2024-12-08T10:00:00',
  },
  {
    id: '5',
    tipo: 'pf',
    documento: '98765432109',
    nome: 'Maria Fernanda Costa',
    endereco: {
      cep: '22041080',
      logradouro: 'Av AtlÃ¢ntica',
      numero: '1500',
      complemento: 'Cobertura',
      bairro: 'Copacabana',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
      codigoMunicipio: '3304557',
    },
    email: 'maria.costa@email.com',
    telefone: '(21) 96666-0005',
    ativo: false,
    totalNotas: 2,
    faturamentoTotal: 1800,
    createdAt: '2024-02-20T11:00:00',
    updatedAt: '2024-09-10T09:00:00',
  },
];

const formatDocument = (doc: string, tipo: 'pj' | 'pf'): string => {
  if (tipo === 'pj') {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const TomadoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTomador, setSelectedTomador] = useState<Tomador | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Form state
  const [formData, setFormData] = useState({
    tipo: 'pj' as 'pj' | 'pf',
    documento: '',
    razaoSocial: '',
    nomeFantasia: '',
    nome: '',
    inscricaoMunicipal: '',
    inscricaoEstadual: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    email: '',
    telefone: '',
  });

  const tabs = [
    { label: 'Todos', count: mockTomadores.length },
    { label: 'Pessoa JurÃ­dica', count: mockTomadores.filter(t => t.tipo === 'pj').length },
    { label: 'Pessoa FÃ­sica', count: mockTomadores.filter(t => t.tipo === 'pf').length },
    { label: 'Inativos', count: mockTomadores.filter(t => !t.ativo).length },
  ];

  const filteredTomadores = mockTomadores.filter(tomador => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      tomador.razaoSocial?.toLowerCase().includes(searchLower) ||
      tomador.nome?.toLowerCase().includes(searchLower) ||
      tomador.nomeFantasia?.toLowerCase().includes(searchLower) ||
      tomador.documento.includes(searchTerm.replace(/\D/g, '')) ||
      tomador.email.toLowerCase().includes(searchLower);
    
    let matchesTab = true;
    if (activeTab === 1) matchesTab = tomador.tipo === 'pj';
    if (activeTab === 2) matchesTab = tomador.tipo === 'pf';
    if (activeTab === 3) matchesTab = !tomador.ativo;
    
    return matchesSearch && matchesTab;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tomador: Tomador) => {
    setAnchorEl(event.currentTarget);
    setSelectedTomador(tomador);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTomador(null);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', tomador?: Tomador) => {
    setDialogMode(mode);
    if (tomador) {
      setFormData({
        tipo: tomador.tipo,
        documento: tomador.documento,
        razaoSocial: tomador.razaoSocial || '',
        nomeFantasia: tomador.nomeFantasia || '',
        nome: tomador.nome || '',
        inscricaoMunicipal: tomador.inscricaoMunicipal || '',
        inscricaoEstadual: tomador.inscricaoEstadual || '',
        cep: tomador.endereco.cep,
        logradouro: tomador.endereco.logradouro,
        numero: tomador.endereco.numero,
        complemento: tomador.endereco.complemento || '',
        bairro: tomador.endereco.bairro,
        cidade: tomador.endereco.cidade,
        uf: tomador.endereco.uf,
        email: tomador.email,
        telefone: tomador.telefone || '',
      });
    } else {
      setFormData({
        tipo: 'pj',
        documento: '',
        razaoSocial: '',
        nomeFantasia: '',
        nome: '',
        inscricaoMunicipal: '',
        inscricaoEstadual: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        email: '',
        telefone: '',
      });
    }
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleTipoChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, tipo: event.target.value as 'pj' | 'pf' });
  };

  const dialogTitle = {
    create: 'Novo Tomador',
    edit: 'Editar Tomador',
    view: 'Detalhes do Tomador',
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Tomadores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cadastro de clientes para emissÃ£o de notas fiscais
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<CloudSync />}>
            Importar CNPJ
          </Button>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filtrar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('create')}
          >
            Novo Tomador
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {mockTomadores.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Tomadores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {mockTomadores.filter(t => t.tipo === 'pj').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pessoa JurÃ­dica
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {mockTomadores.filter(t => t.tipo === 'pf').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pessoa FÃ­sica
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(mockTomadores.reduce((sum, t) => sum + t.faturamentoTotal, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faturamento Total
              </Typography>
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
          {/* Search Bar */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Buscar por nome, CNPJ/CPF, email..."
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
              sx={{ width: 400 }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tomador</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Notas Emitidas</TableCell>
                  <TableCell>Faturamento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">AÃ§Ãµes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTomadores
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((tomador) => (
                    <TableRow key={tomador.id} hover sx={!tomador.ativo ? { opacity: 0.6 } : undefined}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: tomador.tipo === 'pj' ? 'primary.main' : 'secondary.main' }}>
                            {tomador.tipo === 'pj' ? <Business /> : <Person />}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {tomador.razaoSocial || tomador.nome}
                            </Typography>
                            {tomador.nomeFantasia && (
                              <Typography variant="caption" color="text.secondary">
                                {tomador.nomeFantasia}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDocument(tomador.documento, tomador.tipo)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{tomador.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tomador.telefone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tomador.totalNotas}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(tomador.faturamentoTotal)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tomador.ativo ? 'Ativo' : 'Inativo'}
                          color={tomador.ativo ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualizar">
                          <IconButton size="small" onClick={() => handleOpenDialog('view', tomador)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleOpenDialog('edit', tomador)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, tomador)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredTomadores.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Itens por pÃ¡gina"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => selectedTomador && handleOpenDialog('view', selectedTomador)}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => selectedTomador && handleOpenDialog('edit', selectedTomador)}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
          Copiar CNPJ/CPF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><FileDownload fontSize="small" /></ListItemIcon>
          Exportar dados
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Excluir
        </MenuItem>
      </Menu>

      {/* Create/Edit/View Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {formData.tipo === 'pj' ? <Business color="primary" /> : <Person color="primary" />}
              {dialogTitle[dialogMode]}
            </Box>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Tipo de Pessoa */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth disabled={dialogMode === 'view'}>
                  <InputLabel>Tipo de Pessoa</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo de Pessoa"
                    onChange={handleTipoChange}
                  >
                    <MenuItem value="pj">Pessoa JurÃ­dica</MenuItem>
                    <MenuItem value="pf">Pessoa FÃ­sica</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Documento */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label={formData.tipo === 'pj' ? 'CNPJ' : 'CPF'}
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  disabled={dialogMode === 'view'}
                  placeholder={formData.tipo === 'pj' ? '00.000.000/0000-00' : '000.000.000-00'}
                  InputProps={{
                    endAdornment: formData.tipo === 'pj' && dialogMode !== 'view' && (
                      <InputAdornment position="end">
                        <Tooltip title="Buscar dados na Receita Federal">
                          <IconButton size="small">
                            <CloudSync />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Campos PJ */}
              {formData.tipo === 'pj' ? (
                <>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="RazÃ£o Social"
                      value={formData.razaoSocial}
                      onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      value={formData.nomeFantasia}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="InscriÃ§Ã£o Municipal"
                      value={formData.inscricaoMunicipal}
                      onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="InscriÃ§Ã£o Estadual"
                      value={formData.inscricaoEstadual}
                      onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                      disabled={dialogMode === 'view'}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    disabled={dialogMode === 'view'}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>Endereço</Divider>
              </Grid>

              {/* Endereço */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  disabled={dialogMode === 'view'}
                  placeholder="00000-000"
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  label="Logradouro"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="NÃºmero"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Complemento"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="UF"
                  value={formData.uf}
                  onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>Contato</Divider>
              </Grid>

              {/* Contato */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  disabled={dialogMode === 'view'}
                  placeholder="(00) 00000-0000"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>
            {dialogMode === 'view' ? 'Fechar' : 'Cancelar'}
          </Button>
          {dialogMode !== 'view' && (
            <Button variant="contained">
              {dialogMode === 'create' ? 'Cadastrar' : 'Salvar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TomadoresPage;
