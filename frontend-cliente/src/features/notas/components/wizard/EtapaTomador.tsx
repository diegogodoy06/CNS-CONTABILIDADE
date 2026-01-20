import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  alpha,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Business,
  Person,
  Add,
  Check,
  Close,
  History,
  Star,
} from '@mui/icons-material';
import type { Tomador } from '../../../../types';
import tomadoresService from '../../../../services/tomadoresService';

interface EtapaTomadorProps {
  tomadorSelecionado: Tomador | null;
  onSelectTomador: (tomador: Tomador | null) => void;
  error?: string;
}

const formatDocument = (doc: string, tipo: 'pj' | 'pf'): string => {
  if (tipo === 'pj') {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const EtapaTomador: React.FC<EtapaTomadorProps> = ({
  tomadorSelecionado,
  onSelectTomador,
  error,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTomadores, setShowAllTomadores] = useState(false);
  const [novoTomadorOpen, setNovoTomadorOpen] = useState(false);
  const [tomadores, setTomadores] = useState<Tomador[]>([]);
  const [ultimosTomadores, setUltimosTomadores] = useState<Tomador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar tomadores da API
  const fetchTomadores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await tomadoresService.findAll({ limit: 50 });
      setTomadores(response.items || []);
      // Últimos tomadores são os 3 primeiros (ordenados por última nota)
      setUltimosTomadores((response.items || []).slice(0, 3));
    } catch (err) {
      console.error('Erro ao carregar tomadores:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTomadores();
  }, [fetchTomadores]);

  // Filtrar tomadores pela busca
  const filteredTomadores = tomadores.filter((t) => {
    const search = searchTerm.toLowerCase();
    return (
      t.documento.includes(search) ||
      t.razaoSocial?.toLowerCase().includes(search) ||
      t.nome?.toLowerCase().includes(search) ||
      t.nomeFantasia?.toLowerCase().includes(search)
    );
  });

  const handleSelectTomador = (tomador: Tomador) => {
    onSelectTomador(tomador);
    setShowAllTomadores(false);
    setSearchTerm('');
  };

  const handleRemoveTomador = () => {
    onSelectTomador(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Selecione o Tomador do Serviço
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Busque pelo CNPJ, CPF ou nome do cliente que irá receber a nota fiscal
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tomador Selecionado */}
      {tomadorSelecionado ? (
        <Card
          sx={{
            mb: 3,
            border: `2px solid ${theme.palette.primary.main}`,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: tomadorSelecionado.tipo === 'pj' ? 'primary.main' : 'secondary.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  {tomadorSelecionado.tipo === 'pj' ? <Business /> : <Person />}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {tomadorSelecionado.razaoSocial || tomadorSelecionado.nome}
                    </Typography>
                    <Check sx={{ color: 'success.main' }} />
                  </Box>
                  {tomadorSelecionado.nomeFantasia && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {tomadorSelecionado.nomeFantasia}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {tomadorSelecionado.tipo === 'pj' ? 'CNPJ' : 'CPF'}:{' '}
                    {formatDocument(tomadorSelecionado.documento, tomadorSelecionado.tipo)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tomadorSelecionado.endereco.cidade} - {tomadorSelecionado.endereco.uf}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={handleRemoveTomador} color="error" size="small">
                <Close />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Campo de Busca */}
          <TextField
            fullWidth
            placeholder="Buscar por CNPJ, CPF ou nome..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowAllTomadores(true);
            }}
            onFocus={() => setShowAllTomadores(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Últimos Tomadores */}
          {!showAllTomadores && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <History fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Últimos tomadores utilizados
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {ultimosTomadores.map((tomador) => (
                  <Grid item xs={12} md={4} key={tomador.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardActionArea
                        onClick={() => handleSelectTomador(tomador)}
                        sx={{ height: '100%', p: 2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: tomador.tipo === 'pj' ? 'primary.main' : 'secondary.main',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {tomador.tipo === 'pj' ? <Business fontSize="small" /> : <Person fontSize="small" />}
                          </Avatar>
                          <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {tomador.nomeFantasia || tomador.razaoSocial || tomador.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {formatDocument(tomador.documento, tomador.tipo)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Lista Completa de Tomadores */}
          {showAllTomadores && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {filteredTomadores.length} tomador(es) encontrado(s)
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setNovoTomadorOpen(true)}
                >
                  Novo Tomador
                </Button>
              </Box>

              {filteredTomadores.length === 0 ? (
                <Alert severity="info">
                  Nenhum tomador encontrado. Tente outra busca ou cadastre um novo tomador.
                </Alert>
              ) : (
                <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
                  {filteredTomadores.map((tomador, index) => (
                    <React.Fragment key={tomador.id}>
                      <ListItem
                        component="div"
                        onClick={() => handleSelectTomador(tomador)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: tomador.tipo === 'pj' ? 'primary.main' : 'secondary.main',
                            }}
                          >
                            {tomador.tipo === 'pj' ? <Business /> : <Person />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight={500}>
                                {tomador.razaoSocial || tomador.nome}
                              </Typography>
                              {tomador.totalNotas > 10 && (
                                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {tomador.tipo === 'pj' ? 'CNPJ' : 'CPF'}:{' '}
                                {formatDocument(tomador.documento, tomador.tipo)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {tomador.totalNotas} nota(s) emitida(s)
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={tomador.tipo === 'pj' ? 'PJ' : 'PF'}
                            size="small"
                            color={tomador.tipo === 'pj' ? 'primary' : 'secondary'}
                            variant="outlined"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < filteredTomadores.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              <Button
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setShowAllTomadores(false)}
              >
                Cancelar busca
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Botão para novo tomador (quando já tem selecionado) */}
      {tomadorSelecionado && (
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleRemoveTomador}
          >
            Trocar Tomador
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setNovoTomadorOpen(true)}
          >
            Cadastrar Novo
          </Button>
        </Box>
      )}

      {/* Dialog Novo Tomador */}
      <Dialog
        open={novoTomadorOpen}
        onClose={() => setNovoTomadorOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Novo Tomador
            <IconButton onClick={() => setNovoTomadorOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            O cadastro completo de tomadores pode ser feito na seção "Tomadores" do menu.
            Aqui você pode fazer um cadastro rápido.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Funcionalidade em desenvolvimento...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNovoTomadorOpen(false)}>Cancelar</Button>
          <Button variant="contained" disabled>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EtapaTomador;
